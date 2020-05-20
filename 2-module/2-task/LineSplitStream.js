const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.firstCall = false;
    this.rows = '';
  }

  _returnLineByLine(callback) {
    const data = this.rows;
    const rowEndIndex = data.indexOf(os.EOL);
    if (rowEndIndex === -1) {
      if (this.firstCall) {
        callback();
      }
      return;
    }
    callback(null, data.slice(0, rowEndIndex));
    this.rows = data.slice(rowEndIndex + 1);
    if (this.firstCall) {
      this.firstCall = false;
    }
    this._returnLineByLine(callback);
  }

  _transform(chunk, encoding, callback) {
    this.rows += chunk.toString();
    this.firstCall = true;
    this._returnLineByLine(callback);
  }

  _flush(callback) {
    if (this.rows.length) {
      callback(null, this.rows);
    }
  }
}

module.exports = LineSplitStream;
