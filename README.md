#### Project 7 🐦

## Twitter Interface

###### This is the seventh of twelve projects for the 🏡 Treehouse Techdegree Full Stack JavaScript.

This Twitter Interface will show your 5 most recent tweets, 5 most recent friends, and 5 most recent sent and received messages. You can also post to Twitter from the sticky bar at the bottom.

To use this, set up a [Twitter App](https://apps.twitter.com/), with 'Read, Write and Access direct messages' permissions, then generate your keys and tokens in Keys and Access Tokens.

Set up a config.js file in the root directory with your Twitter keys/tokens like this:

```
module.exports = {
  consumer_key: "YOUR-CONSUMER-KEY",
  consumer_secret: "YOUR-CONSUMER-SECRET",
  access_token: "YOUR-ACCESS-TOKEN",
  access_token_secret: "YOUR-ACCESS-TOKEN-SECRET"
};
```

then  `npm install` & `npm start` and view it on http://localhost:7777/