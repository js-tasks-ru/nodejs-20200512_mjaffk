const fs = require('fs');

function deleteFile(filepath) {
  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }
  });
}

module.exports = deleteFile;
