const assert = require("assert");
const Encoder = require("./encoder");
const messages = require("./messages");
const messages_impl = require("./messages_impl");

describe("Command messages unit test", () => {
  it("encode zones violation command", () => {
    const frame = messages.encodeZonesViolationCommand();
    assert.equal(frame.length, 7);
    assert.deepEqual(frame.subarray(2, 3), Buffer.from([messages_impl.Commands.ZonesViolation]));
  });

  it("encode zones tamper command", () => {
    const frame = messages.encodeZonesTamperCommand();
    assert.equal(frame.length, 7);
    assert.deepEqual(frame.subarray(2, 3), Buffer.from([messages_impl.Commands.ZonesTamper]));
  });

  it("encode outputs state command", () => {
    const frame = messages.encodeOutputsStateCommand();
    assert.equal(frame.length, 7);
    assert.deepEqual(frame.subarray(2, 3), Buffer.from([messages_impl.Commands.OutputsState]));
  });

  it("encode new data command", () => {
    const frame = messages.encodeNewDataCommand();
    assert.equal(frame.length, 7);
    assert.deepEqual(frame.subarray(2, 3), Buffer.from([messages_impl.Commands.NewData]));
  });
});

describe("Answer messages unit test", () => {
  it("decode corrupted frame", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x00].concat(Array(16).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame().subarray(0, -1));
    assert.strictEqual(message, null);
  });

  it("decode too short frame", () => {
    const message = messages.decodeMessage(
      Buffer.from([0xfe, 0xfe, 0x01, 0x02, 0xfe, 0x0d])
    );
    assert.strictEqual(message, null);
  });

  it("decode frame with incorrect CRC", () => {
    const message = messages.decodeMessage(
      Buffer.from([0xfe, 0xfe, 0x01, 0x02, 0x03, 0x00, 0x00, 0xfe, 0x0d])
    );
    assert.strictEqual(message, null);
  });

  it("decode zones violation answer short", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x00].concat(Array(16).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.ZonesViolationAnswer);
    for (let i = 0; i < 16; ++i) {
      assert.strictEqual(
        message.flags[i],
        i % 2 != 0,
        "for flag with index " + i
      );
    }
  });

  it("decode zones violation answer long", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x00].concat(Array(32).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.ZonesViolationAnswer);
    for (let i = 0; i < 32; ++i) {
      assert.strictEqual(
        message.flags[i],
        i % 2 != 0,
        "for flag with index " + i
      );
    }
  });

  it("decode zones tamper answer short", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x01].concat(Array(16).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.ZonesTamperAnswer);
    for (let i = 0; i < 16; ++i) {
      assert.strictEqual(
        message.flags[i],
        i % 2 != 0,
        "for flag with index " + i
      );
    }
  });

  it("decode zones tamper answer long", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x01].concat(Array(32).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.ZonesTamperAnswer);
    for (let i = 0; i < 32; ++i) {
      assert.strictEqual(
        message.flags[i],
        i % 2 != 0,
        "for flag with index " + i
      );
    }
  });

  it("decode outputs state answer short", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x17].concat(Array(16).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.OutputsStateAnswer);
    for (let i = 0; i < 16; ++i) {
      assert.strictEqual(
        message.flags[i],
        i % 2 != 0,
        "for flag with index " + i
      );
    }
  });

  it("decode outputs state answer long", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x17].concat(Array(32).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.OutputsStateAnswer);
    for (let i = 0; i < 32; ++i) {
      assert.strictEqual(
        message.flags[i],
        i % 2 != 0,
        "for flag with index " + i
      );
    }
  });

  it("decode new data answer, zones violation changed", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x7f, 0x01, 0x00, 0x00, 0x00, 0x00]));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.NewDataAnswer);
    assert.strictEqual(message.zonesViolationChanged(), true);
    assert.strictEqual(message.zonesTamperChanged(), false);
    assert.strictEqual(message.outputsStateChanged(), false);
  });

  it("decode new data answer, zones tamper changed", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x7f, 0x02, 0x00, 0x00, 0x00, 0x00]));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.NewDataAnswer);
    assert.strictEqual(message.zonesViolationChanged(), false);
    assert.strictEqual(message.zonesTamperChanged(), true);
    assert.strictEqual(message.outputsStateChanged(), false);
  });

  it("decode new data answer, outputs state changed", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x7f, 0x00, 0x00, 0x80, 0x00, 0x00]));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.NewDataAnswer);
    assert.strictEqual(message.zonesViolationChanged(), false);
    assert.strictEqual(message.zonesTamperChanged(), false);
    assert.strictEqual(message.outputsStateChanged(), true);
  });

  it("decode message with unsupported command code", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x7e, 0x00, 0x00, 0x80, 0x00, 0x00]));
    const message = messages.decodeMessage(encoder.frame());
    assert.strictEqual(message, null);
  });

  it("decode message of incorrect length", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x00].concat(Array(17).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.strictEqual(message, null);
  });
});
