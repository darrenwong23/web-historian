var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./utils');
var fs = require('fs');
var httpRequest = require('http-request');

// require more modules/folders here!




var actions = {
  'GET': function(req, res, data){
    utils.sendResponse(res, data);
  },
  'POST': function(req, res, data){
    utils.sendResponse(res, data, 302);
  }
};

exports.routes = {
  "/": __dirname + "/public/index.html"};

exports.route = '';

exports.handleRequest = function (req, res) {
    console.log(exports.routes);


  exports.route = exports.routes[req.url];

  if(req.method === 'POST') {

    exports.handleURLSubmit(req,res);

  }
  if( !exports.route ){
    utils.sendResponse(res, "Not Found", 404);
  } else {
    fs.readFile(exports.route, function(error, content) {
      actions[req.method](req, res, content);
    });
  }
};



exports.handleURLSubmit = function(req,res) {
  var str = '';

  req.on('data', function (chunk) {
    str += chunk;
   });

  req.on('end', function () {
    var url = str.slice(4);

    // write submitted URL into sites.text
    fs.writeFileSync(archive.paths.list, url + '\n',{flag:"a"});
    url = '/' + url;
    // insert submitted URL into routes
    //
    console.log('1', exports.routes[url]);
    if(!exports.routes[url]){
      exports.routes[url] = archive.paths.archivedSites + url + '/index.html';
    }
    console.log('2', exports.routes[url]);


    exports.route = exports.routes[url];

    httpRequest.get('http:/' + url, function (err, res) {
      if (err) {
        console.error(err);
        return;
      }

      //if file exists, pull new archive
      if(fs.existsSync(exports.routes[url])){
        fs.writeFileSync(exports.routes[url] + '/index.html', res.buffer.toString());
      } else {
        //if file doesn't exist, create new folder and archive
        fs.mkdirSync(exports.routes[url]);
        fs.writeFileSync(exports.routes[url] + '/index.html', res.buffer.toString());
      }
    });
  });
};
