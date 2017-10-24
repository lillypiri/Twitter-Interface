const express = require("express");
const Twit = require("twit");
const config = require("./config");
const app = express();
const moment = require("moment");
const objectValues = require('object-values');

const T = new Twit(config);

app.use("/static", express.static(__dirname + "/public"));
app.set("view engine", "pug");

function groupMessages(userId, received, sent) {
  const allMessages= received.concat(sent).sort((a, b) => Date.parse(a.created_at) < Date.parse(b.created_at) ? -1 : 1);

  let groups = {};

  allMessages.forEach(message => {
    // if we sent it, group is the recipient
    if (message.sender_id === userId) {
      message.me = true;
      groups[message.recipient_id] = groups[message.recipient_id] || [];
      groups[message.recipient_id].push(message);

    // if we received it, group is the sender
    } else {
      message.me = false;
      groups[message.sender_id] = groups[message.sender_id] || [];
      groups[message.sender_id].push(message);
    }
  });

  return objectValues(groups);
}
//q: "from:IAmTomNook"


app.get("/", (req, res) => {
  // Do all of the things at once
  T.get("account/verify_credentials").then(verifyCred => {
    let context = {
      verifycred: verifyCred.data
    }
    const screenname = context.verifycred.screen_name;
    Promise.all([
      T.get("search/tweets", { q: screenname, count: 5 }),
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
          tweets: statusResponse.data.statuses,
          messages: groupMessages(
            921234828749504500,
            messageResponse.data,
            sentMessageResponse.data
          ),
          friends: friendResponse.data.users,
          verifycred: verifyCred.data,
          moment: require("moment")
        };
        res.render("index", context);
        // // Dump the context to the screen (view source to see it nicely formatted)
        // res.send(JSON.stringify(context, null, 4));
      }
    );
  })   
});

// run the server
app.listen(7777, () => {
  console.log("Listening on 7777");
});