"use strict";

let _ =  require("lodash");
let async = require("async");

let Xray = require("x-ray");

let x = new Xray();

const bandNameSource = "http://en.wikipedia.org/wiki/Special:Random";
const albumNameSource = "http://www.quotationspage.com/random.php3";
const imageSource = "https://www.flickr.com/explore/interesting/7days";

let albumData = {};

let fetchBandName = (cb) => {
  x(bandNameSource, {
    bandName: "#firstHeading"
  })((err, scrapedBandNameObject) => {
    cb(err, scrapedBandNameObject.bandName);
  });
};

let fetchAlbumName = (cb) => {
  x(albumNameSource, {
      albumName: "dt.quote"
  })((err, scrapedAlbumNameObject) => {
    let explodedBandName = scrapedAlbumNameObject.albumName.replace(/[^\w\s]/g, "").split(" ");

    let albumTitle = explodedBandName
      .slice(explodedBandName.length - (Math.floor(Math.random() * 8) + 2), explodedBandName.length - 1)
      .join(" ")
      .toLowerCase();

    cb(err, albumTitle);
  });
};

let fetchAlbumArt = (cb) => {
  x(imageSource, {
    href: ".photo_container.pc_m a@href"
  })((err, obj) => {
    x(obj.href, {
      imageUrl: ".main-photo@src"
    })((err, artScrape) => {
      cb(err, artScrape.imageUrl);
    });
  });
}

module.exports = function(cb1, cb2) {
  console.log(cb1, cb2, "collecting info")
  async.parallel({
    bandName: fetchBandName,
    artUrl: fetchAlbumArt,
    albumTitle: fetchAlbumName
  }, (err, results) => {
    console.log("Got all info");
    cb1(err, results, cb2);
  });
}
