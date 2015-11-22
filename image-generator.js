"use strict";

let fs = require("fs");
let http = require("http");

let request = require("request");
let gm = require("gm");

let infoCollector = require("./info-collector");


let generateImage = (err, info, cb) => {
  if (err) console.log(err);

  let file = fs.createWriteStream("./images/source.jpg");
  request(info.artUrl).pipe(file);

  file.on("finish", (err) => {
    if (err) console.log(err);
    console.log("file's done");

    gm("./images/source.jpg").size({ bufferStream: true }, function (err, size) {
      if (err) console.log(err);
      gm("./images/source.jpg")
        .resize(800)
        .fill("#000000")
        .font("AvantGarde-Demi", 45)
        .drawText(30, 50, info.bandName, "NorthWest")
        .font("Palatino-BoldItalic", 30)
        .fill("#ffffff")
        .drawText(50, 20, info.albumTitle, "SouthEast")
        .write("./images/albumCover.jpg", function (err) {
          if (err) console.log(err);
          console.log("done writing, executing callback");
          cb();
        });
    });
  })

}

module.exports = (cb) => {
  infoCollector(generateImage, cb);
};
