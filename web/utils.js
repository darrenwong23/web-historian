var archive = require('../helpers/archive-helpers');


var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'content-type': "text/html"
};

exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};
