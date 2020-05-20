const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const rowEndIndex = chunk.indexOf(os.EOL);
    this.nextRows += chunk.splice(rowEndIndex);
    callback(null, chunk.splice(0, rowEndIndex));
  }

  _flush(callback) {
    while (this.nextRows.length) {
      const rowEndIndex = this.nextRows.indexOf(os.EOL);
      if (rowEndIndex === -1) {
        return;
      }
      this.nextRows = this.nextRows.splice(rowEndIndex);
      callback(null, this.this.nextRows.splice(0, rowEndIndex));
    }
  }
}

module.exports = LineSplitStream;
