const express = require("express");
const Twit = require("twit");
const config = require("./config");
const app = express();
const moment = require("moment");
const objectValues = require('object-values');
const bodyParser = require("body-parser");

const T = new Twit(config);

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"));
app.set("view engine", "pug");

function groupMessages(userId, received, sent) {
  const allMessages= received.concat(sent).sort((a, b) => Date.parse(a.created_at) < Date.parse(b.created_at) ? -1 : 1);

  let groups = {};

  allMessages.forEach(message => {
    // If we sent it, group is the recipient
    if (message.sender_id === userId) {
      message.me = true;
      groups[message.recipient_id] = groups[message.recipient_id] || [];
      groups[message.recipient_id].push(message);

    // If we received it, group is the sender
    } else {
      message.me = false;
      groups[message.sender_id] = groups[message.sender_id] || [];
      groups[message.sender_id].push(message);
    }
  });

  return objectValues(groups);
}

app.post("/tweet", (req, res) => {
  T.post("statuses/update", { status: req.body.tweet })
    .then(response => {
      res.render("tweet", { tweet: response.data, moment: require("moment") });
    })
    .catch(error => {
      throw error
    });
});

app.get("/", (req, res) => {
  // First get the authenticated user's info so we can use their screenname to find tweets by them
  T.get("account/verify_credentials").then(verifyCred => {
    let context = {
      verifycred: verifyCred.data
    }
    const screenname = context.verifycred.screen_name;

    // Do all of the things at once
    Promise.all([
      T.get("statuses/user_timeline", { q: screenname, count: 5 }),
      T.get("direct_messages", { count: 5 }),
      T.get("direct_messages/sent", { count: 5 }),
      T.get("friends/list", { count: 5 }),
      T.get("account/verify_credentials")
    ]).then(
      (
        [
          statusResponse,
          messageResponse,
          sentMessageResponse,
          friendResponse,
          verifyCred
        ]
      ) => {
        // Merge them into an object that the Pug view can use
        let context = {
          tweets: statusResponse.data,
          messages: groupMessages(
          verifyCred.data.id,
          messageResponse.data,
          sentMessageResponse.data
          ),
          friends: friendResponse.data.users,
          verifycred: verifyCred.data,
          moment: require("moment")
        };
        res.render("index", context);
      }
    ).catch(error => {
      throw error
    })
  }).catch(error => {
    throw error
  })   
});

// Run the server
app.listen(7777, () => {
  console.log("Listening on 7777");
});

// Show errors if something goes wrong 
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Sorry, something broke!");
});


app.get("*", function(req, res) {
  res.status(404).send("Sorry, we couldn't find that page.");
});