const Encoder = require("./encoder");
const assert = require("assert");

describe("Encoder unit test", () => {
  it("encode one byte long frame", () => {
    const encoder = new Encoder();
    encoder.addByte(0x09);
    assert.deepEqual(
      encoder.frame(),
      Buffer.from([0xfe, 0xfe, 0x09, 0xd7, 0xeb, 0xfe, 0x0d])
    );
  });

  it("encode frame with escape byte", () => {
    const encoder = new Encoder();
    encoder.addBytes([0x09, 0xfe]);
    assert.deepEqual(
      encoder.frame(),
      Buffer.from([0xfe, 0xfe, 0x09, 0xfe, 0xf0, 0x51, 0x76, 0xfe, 0x0d])
    );
  });

  it("encode frame with escape byte in CRC", () => {
    const encoder = new Encoder();
    encoder.addBytes([0x1c]);
    assert.deepEqual(
      encoder.frame(),
      Buffer.from([0xfe, 0xfe, 0x1c, 0xd7, 0xfe, 0xf0, 0xfe, 0x0d])
    );
  });
});
