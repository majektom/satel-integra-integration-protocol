class Crc {
  constructor() {
    this._crc = 0x147a;
  }

  addByte(byte) {
    this._crc = (this._crc << 1) + (this._crc >> 15);
    this._crc ^= 0xffff;
    this._crc &= 0xffff;
    this._crc = this._crc + (this._crc >> 8) + byte;
    this._crc &= 0xffff;
  }

  addBytes(bytes) {
    bytes.forEach((value) => this.addByte(value & 0xff));
  }

  get crc() {
    return this._crc;
  }
}

module.exports = Crc;
