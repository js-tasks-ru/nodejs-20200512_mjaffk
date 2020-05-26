const url = require('url');
const path = require('path');
const fs = require('fs');

function getResponse(req, res) {
  const pathname = url.parse(req.url)
      .pathname
      .slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const hasNestedPath = pathname.indexOf('/') !== -1;

  if (hasNestedPath) {
    res.statusCode = 400;
    res.end('HTTP 400 Bad Request');
    return;
  }

  fs.open(filepath, 'r', (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }
      throw err;
    } else {
      const readStream = fs.createReadStream(filepath);
      readStream.on('open', () => {
        res.statusCode = 200;
        readStream.pipe(res);
      });

      readStream.on('error', (err) => {
        throw err;
      });
    }
  });
}

module.exports = getResponse;


