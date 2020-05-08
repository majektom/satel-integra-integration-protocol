const assert = require("assert");
const Encoder = require("./encoder");
const messages = require("./messages");

describe("Command messages unit test", () => {
  it("encode zones violation command", () => {
    const command = new messages.ZonesViolationCommand();
    assert.deepEqual(
      command.encode(),
      Buffer.from([0xfe, 0xfe, 0x00, 0xd7, 0xe2, 0xfe, 0x0d])
    );
  });

  it("encode zones tamper command", () => {
    const command = new messages.ZonesTamperCommand();
    assert.deepEqual(
      command.encode(),
      Buffer.from([0xfe, 0xfe, 0x01, 0xd7, 0xe3, 0xfe, 0x0d])
    );
  });

  it("encode outputs state command", () => {
    const command = new messages.OutputsStateCommand();
    assert.deepEqual(
      command.encode(),
      Buffer.from([0xfe, 0xfe, 0x17, 0xd7, 0xf9, 0xfe, 0x0d])
    );
  });

  it("encode new data command", () => {
    const command = new messages.NewDataCommand();
    assert.deepEqual(
      command.encode(),
      Buffer.from([0xfe, 0xfe, 0x7f, 0xd8, 0x61, 0xfe, 0x0d])
    );
  });
});

describe("Answer messages unit test", () => {
  it("decode zones violation answer short", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x00].concat(Array(16).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.ok(message instanceof messages.ZonesViolationAnswer);
    for (let i = 0; i < 16; ++i) {
      assert.strictEqual(
        message._flags[i],
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
        message._flags[i],
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
        message._flags[i],
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
        message._flags[i],
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
        message._flags[i],
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
        message._flags[i],
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

  it("decode frame with unsupported command code", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x7e, 0x00, 0x00, 0x80, 0x00, 0x00]));
    const message = messages.decodeMessage(encoder.frame());
    assert.strictEqual(message, null);
  });

  it("decode frame of incorrect length", () => {
    const encoder = new Encoder();
    encoder.addBytes(Buffer.from([0x00].concat(Array(17).fill(0xaa))));
    const message = messages.decodeMessage(encoder.frame());
    assert.strictEqual(message, null);
  });
});
