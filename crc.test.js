const Crc = require("./crc");
const assert = require("assert");

describe("Crc unit test", () => {
  it("AddByte() method", () => {
    const crc = new Crc();
    crc.addByte(0xe0);
    assert.strictEqual(crc.crc, 0xd8c2);
    crc.addByte(0x12);
    assert.strictEqual(crc.crc, 0x4eda);
    crc.addByte(0x34);
    assert.strictEqual(crc.crc, 0x62e1);
    crc.addByte(0xff);
    assert.strictEqual(crc.crc, 0x3b76);
    crc.addByte(0xff);
    assert.strictEqual(crc.crc, 0x8a9b);
  });

  it("AddBytes() method", () => {
    const crc = new Crc();
    crc.addBytes([0xe0, 0x12, 0x34, 0xff, 0xff]);
    assert.strictEqual(crc.crc, 0x8a9b);
  });
});
