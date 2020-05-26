const url = require('url');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');
const deleteFile = require('./deleteFile');

function postResponse(req, res) {
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

  fs.open(filepath, 'wx', (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('File already exist');
        return;
      }
      throw err;
    } else {
      const limitStream = new LimitSizeStream({
        limit: 1024 * 1024, // limit take bytes and we need 1Mb
      });
      const writeStream = fs.createWriteStream(filepath);

      req.pipe(limitStream)
          .pipe(writeStream);

      limitStream.on('error', (err) => {
        deleteFile(filepath);
        if (err instanceof LimitExceededError) {
          res.statusCode = 413;
          res.end('File is too large');
        } else {
          throw err;
        }
      });

      req.on('end', () => {
        res.statusCode = 201;
        res.end();
      });

      req.on('close', () => {
        if (req.aborted) {
          fs.unlink(filepath, (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    }
  });
}

module.exports = postResponse;
