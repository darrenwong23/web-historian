var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./utils');
var fs = require('fs');

// require more modules/folders here!

var actions = {
  'GET': function(req, res){
    utils.sendResponse(res, "SUCCESS");
  }
};

var routes = {
  "/": __dirname + "/public/index.html",
  "/www.google.com": archive.paths.archivedSites + "/www.google.com"
};

exports.handleRequest = function (req, res) {
  var route = routes[req.url];
  var status = 200;
  if(req.method === 'POST') {
    var str = '';
    req.on('data', function (chunk) {
      str += chunk;
     });

    req.on('end', function () {
      var url = str.slice(4)
      fs.writeFileSync(archive.paths.list, url + '\n',{flag:"a"});
      routes["/" + url] = archive.paths.archivedSites + "/" + url
      console.log(routes);
      status = 302;
    });
  }
  if( !route ){
    utils.sendResponse(res, "Not Found", 404);
  } else {
    fs.exists(route, function(exists){
      if(exists) {
        fs.readFile(route, function(error, content) {
          res.writeHead(status, null);
          res.end(content, 'utf-8');
        });
      }
    });
  }
};
