const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.firstCall = false;
    this.rows = '';
  }

  _returnLineByLine() {
    const data = this.rows;
    const rowEndIndex = data.indexOf(os.EOL);
    if (rowEndIndex === -1) {
      return;
    }
    this.push(data.slice(0, rowEndIndex));
    this.rows = data.slice(rowEndIndex + 1);
    if (this.firstCall) {
      this.firstCall = false;
    }
    this._returnLineByLine();
  }

  _transform(chunk, encoding, callback) {
    this.rows += chunk.toString();
    this.firstCall = true;
    this._returnLineByLine();
    callback();
  }

  _flush(callback) {
    if (this.rows.length) {
      callback(null, this.rows);
    }
  }
}

module.exports = LineSplitStream;
