"use strict";

let fs = require("fs");
let _ = require('lodash');

let Twit = require('twit');
let T = new Twit(require('./config.js'));

let imageGenerator = require("./image-generator");

function postTweet() {
  var b64content = fs.readFileSync('./images/albumCover.jpg', { encoding: 'base64' })
  console.log("Posting tweet data, media: ", b64content);
  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    var mediaIdStr = data.media_id_string
    var params = { status: 'Dropping later this month! #albumreleaseparty', media_ids: [mediaIdStr] }
    console.log(params);
    T.post('statuses/update', params, function (err, data, response) {
      console.log(data);
    });
  });
};

function tweet() {
  imageGenerator(postTweet);
}

setInterval(() => {
  try {
    tweet();
  }
  catch (e) {
    console.log(e)
  }
}, 1000 * 60 * 60 * 4)

tweet();


