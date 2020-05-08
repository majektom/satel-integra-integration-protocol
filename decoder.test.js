const Decoder = require("./decoder");
const assert = require("assert");

function verifyFrame(decoder, encodedFrame, expectedDecodedFrame) {
  assert.deepEqual(
    encodedFrame.map((value) => {
      return decoder.addByte(value);
    }),
    [
      ...Array(encodedFrame.length - 1)
        .fill(false)
        .concat([true]),
    ]
  );
  assert.deepEqual(decoder.frame(), Buffer.from(expectedDecodedFrame));
}

describe("Decoder uint test", () => {
  it("decode one byte frame", () => {
    const decoder = new Decoder();
    verifyFrame(decoder, [0xfe, 0xfe, 0x01, 0xfe, 0x0d], [0x01]);
  });

  it("decode two bytes frame", () => {
    const decoder = new Decoder();
    verifyFrame(decoder, [0xfe, 0xfe, 0x01, 0x02, 0xfe, 0x0d], [0x01, 0x02]);
  });

  it("decode frame after another frame", () => {
    const decoder = new Decoder();
    verifyFrame(decoder, [0xfe, 0xfe, 0x01, 0x02, 0xfe, 0x0d], [0x01, 0x02]);
    verifyFrame(decoder, [0xfe, 0xfe, 0x03, 0x04, 0xfe, 0x0d], [0x03, 0x04]);
  });

  it("decode frame after another frame with trash in between", () => {
    const decoder = new Decoder();
    verifyFrame(decoder, [0xfe, 0xfe, 0x01, 0x02, 0xfe, 0x0d], [0x01, 0x02]);
    assert.equal(decoder.addByte(0xaa), false);
    assert.equal(decoder.addByte(0xab), false);
    verifyFrame(decoder, [0xfe, 0xfe, 0x03, 0x04, 0xfe, 0x0d], [0x03, 0x04]);
  });

  it("decode frame with escape byte in the middle", () => {
    const decoder = new Decoder();
    verifyFrame(
      decoder,
      [0xfe, 0xfe, 0x01, 0xfe, 0xf0, 0x02, 0xfe, 0x0d],
      [0x01, 0xfe, 0x02]
    );
  });

  it("decode frame with escape byte at the end", () => {
    const decoder = new Decoder();
    verifyFrame(
      decoder,
      [0xfe, 0xfe, 0x01, 0xfe, 0xf0, 0xfe, 0x0d],
      [0x01, 0xfe]
    );
  });

  it("decode frame with escape bytes before the beginning", () => {
    const decoder = new Decoder();
    verifyFrame(decoder, [0xfe, 0xfe, 0xfe, 0xfe, 0xf0, 0xfe, 0x0d], [0xf0]);
  });

  it("decode frame after incomplete frame", () => {
    const decoder = new Decoder();
    verifyFrame(
      decoder,
      [0xfe, 0xfe, 0x01, 0xfe, 0xfe, 0x02, 0xfe, 0x0d],
      [0x02]
    );
  });

  it("decode invalid frame - regular byte after escape byte", () => {
    const decoder = new Decoder();
    verifyFrame(
      decoder,
      [0xfe, 0xfe, 0x01, 0xfe, 0x02, 0xfe, 0x0d, 0xfe, 0xfe, 0x03, 0xfe, 0x0d],
      [0x03]
    );
  });

  it("decode invalid frame - one start byte only", () => {
    const decoder = new Decoder();
    verifyFrame(
      decoder,
      [0xfe, 0x01, 0xfe, 0x02, 0xfe, 0x0d, 0xfe, 0xfe, 0x03, 0xfe, 0x0d],
      [0x03]
    );
  });

  it("decode frame with three start bytes", () => {
    const decoder = new Decoder();
    verifyFrame(decoder, [0xfe, 0xfe, 0xfe, 0x03, 0xfe, 0x0d], [0x03]);
  });
});
