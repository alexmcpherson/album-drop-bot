"use strict";

let fs = require("fs");
let http = require("http");

let request = require("request");

let gm = require("gm");

let InfoCollector = require("./info-collector");

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}


let generateImage = (err, info) => {
  if (err) { throw err; }

  let file = fs.createWriteStream("./try.jpg");
  request(info.artUrl).pipe(file);

  file.on("finish", (err) => {
    console.log("file's done");
    gm("./try.jpg").size({ bufferStream: true }, function (err, size) {
        if (err || (size.width !== 500 || size.height < 300 || size.height > 350)) { throw err; }
        gm("./try.jpg")
          .resize(800)
          .fill("#000000")
          // .font("Times-Roman", 30)
          .font("AvantGarde-Book", 30)
          .drawText(20, 40, info.bandName)
          // .font("Times-Italic", 30)
          .font("Palatino-BoldItalic", 30)
          .fill("#ffffff")
          .drawText(280, 490, info.albumTitle)
          .write("./annotated.jpg", function (err) {
            if (!err) console.log(err);

          });
    });
  })

}

InfoCollector(generateImage);