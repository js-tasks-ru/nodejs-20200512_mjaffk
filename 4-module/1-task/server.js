const http = require('http');
const getResponse = require('./getResponse');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'GET': {
      getResponse(req, res);
      break;
    }

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

server.on('error', (req, res) => {
  res.statusCode = 500;
  res.end('Internal Server Error');
});

module.exports = server;
