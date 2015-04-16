var fs = require('fs');
var handler = require("./request-handler");
var archive = require('../helpers/archive-helpers');



// Sync is ok here because this is called just once on startup.
module.exports = function () {
  // if the archive folder doesn't exist, create it.
  if (!fs.existsSync("../archives")) {
    // We use fs.mkdirSync to create the folder
    fs.mkdirSync("../archives");
  }

  // if the file doesn't exist, create it.
  if (!fs.existsSync("../archives/sites.txt")) {
    // We use fs.openSync to create the file
    var file = fs.openSync("../archives/sites.txt", "w");
    fs.closeSync(file);
  } else {
    //file exists, populate route object

    var results = (fs.readFileSync(archive.paths.list, 'utf8')).split('\n');
    //iterate over array and insert into handler.routes
    results.forEach(function(url){
      if(url !== "") {
        handler.routes["/" + url] = archive.paths.archivedSites + "/" + url + '/index.html';
      }
    });
  }

  // if the folder doesn't exist, create it.
  if (!fs.existsSync("../archives/sites")) {
    // We use fs.mkdirSync to create the folder
    fs.mkdirSync("../archives/sites");
  }
};
