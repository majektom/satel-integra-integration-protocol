const Crc = require("./crc");

function encodeByte(byte, frame) {
  frame.push(byte);
  if (byte == 0xfe) {
    frame.push(0xf0);
  }
}

class Encoder {
  constructor() {
    this._frame = [];
    this._crc = new Crc();
  }

  addByte(byte) {
    if (this._frame.length == 0) {
      this._frame.push(0xfe);
      this._frame.push(0xfe);
    }
    encodeByte(byte, this._frame);
    this._crc.addByte(byte);
  }

  addBytes(bytes) {
    bytes.forEach((byte) => this.addByte(byte));
  }

  frame() {
    const result = this._frame;
    encodeByte(this._crc.crc >> 8, result);
    encodeByte(this._crc.crc & 0xff, result);
    result.push(0xfe);
    result.push(0x0d);
    this._frame = [];
    this._crc = new Crc();
    return Buffer.from(result);
  }
}

module.exports = Encoder;
