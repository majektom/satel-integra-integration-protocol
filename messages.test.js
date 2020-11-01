const assert = require("assert");
const Encoder = require("./encoder");
const messages = require("./messages");
const messages_impl = require("./messages_impl");

describe("Message encoding unit tests", function () {
  let noDataCommandTests = [
    {
      name: "zones violation",
      func: messages.encodeZonesViolationCommand,
      command: messages_impl.Commands.ZonesViolation,
    },
    {
      name: "zones tamper",
      func: messages.encodeZonesTamperCommand,
      command: messages_impl.Commands.ZonesTamper,
    },
    {
      name: "outputs state",
      func: messages.encodeOutputsStateCommand,
      command: messages_impl.Commands.OutputsState,
    },
    {
      name: "new data",
      func: messages.encodeNewDataCommand,
      command: messages_impl.Commands.NewData,
    },
  ];

  noDataCommandTests.forEach(function (test) {
    it("encode " + test.name + " command", function () {
      const frame = test.func();
      assert.equal(frame.length, 7);
      assert.equal(frame[2], test.command);
    });
  });

  let outputsChangeTests = [
    {
      name: "outputs on",
      func: messages.encodeOutputsOnCommand,
      command: messages_impl.Commands.OutputsOn,
    },
    {
      name: "outputs off",
      func: messages.encodeOutputsOffCommand,
      command: messages_impl.Commands.OutputsOff,
    },
    {
      name: "outputs switch",
      func: messages.encodeOutputsSwitchCommand,
      command: messages_impl.Commands.OutputsSwitch,
    },
  ];

  outputsChangeTests.forEach(function (test) {
    it("encode short " + test.name + " command", function () {
      const outputs = new Array(128).fill(false, 0, 128);
      outputs[0] = true;
      outputs[2] = true;
      outputs[61] = true;
      outputs[119] = true;
      const frame = test.func("0123456789fffFFF", outputs);
      assert.equal(frame.length, 31);
      assert.equal(frame[2], test.command);
      assert.deepEqual(
        frame.subarray(3, 11),
        Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xff, 0xff, 0xff])
      );
      assert.deepEqual(
        frame.subarray(11, 27),
        Buffer.from([
          0x05,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x20,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x80,
          0x00,
        ])
      );
    });

    it("encode long " + test.name + " command", function () {
      const outputs = new Array(256).fill(false, 0, 128);
      outputs[0] = true;
      outputs[2] = true;
      outputs[61] = true;
      outputs[254] = true;
      const frame = test.func("0123456789fffFFF", outputs);
      assert.equal(frame.length, 47);
      assert.equal(frame[2], test.command);
      assert.deepEqual(
        frame.subarray(3, 11),
        Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xff, 0xff, 0xff])
      );
      assert.deepEqual(
        frame.subarray(11, 43),
        Buffer.from([
          0x05,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x20,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x40,
        ])
      );
    });
  });
});

describe("Message decoding unit tests", () => {
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

  let flagArrayAnswerTests = [
    {
      name: "zones violation",
      message: messages.ZonesViolationAnswer,
      command: messages_impl.Commands.ZonesViolation,
    },
    {
      name: "zones tamper",
      message: messages.ZonesTamperAnswer,
      command: messages_impl.Commands.ZonesTamper,
    },
    {
      name: "outputs state",
      message: messages.OutputsStateAnswer,
      command: messages_impl.Commands.OutputsState,
    },
  ];

  flagArrayAnswerTests.forEach(function (test) {
    it("decode short " + test.name + " answer", function () {
      const encoder = new Encoder();
      encoder.addBytes(
        Buffer.from([test.command].concat(Array(16).fill(0xaa)))
      );
      const message = messages.decodeMessage(encoder.frame());
      assert.ok(message instanceof test.message);
      for (let i = 0; i < 16; ++i) {
        assert.strictEqual(
          message.flags[i],
          i % 2 != 0,
          "for flag with index " + i
        );
      }
    });

    it("decode long " + test.name + " answer", function () {
      const encoder = new Encoder();
      encoder.addBytes(
        Buffer.from([test.command].concat(Array(32).fill(0xaa)))
      );
      const message = messages.decodeMessage(encoder.frame());
      assert.ok(message instanceof test.message);
      for (let i = 0; i < 16; ++i) {
        assert.strictEqual(
          message.flags[i],
          i % 2 != 0,
          "for flag with index " + i
        );
      }
    });
  });

  let newDataAnswerTests = [
    { name: "zones violation", command: messages_impl.Commands.ZonesViolation },
    { name: "zones tamper", command: messages_impl.Commands.ZonesTamper },
    { name: "outputs state", command: messages_impl.Commands.OutputsState },
  ];

  newDataAnswerTests.forEach(function (test) {
    it("decode new data answer, " + test.name + " changed", function () {
      const encoder = new Encoder();
      const frame = Buffer.from([
        messages_impl.Commands.NewData,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
      ]);
      const index = Math.floor(test.command / 8) + 1;
      frame[index] = frame[index] | (1 << test.command % 8);
      encoder.addBytes(frame);
      const message = messages.decodeMessage(encoder.frame());
      assert.ok(message instanceof messages.NewDataAnswer);
      assert.strictEqual(
        message.zonesViolationChanged(),
        test.command == messages_impl.Commands.ZonesViolation
      );
      assert.strictEqual(
        message.zonesTamperChanged(),
        test.command == messages_impl.Commands.ZonesTamper
      );
      assert.strictEqual(
        message.outputsStateChanged(),
        test.command == messages_impl.Commands.OutputsState
      );
    });
  });

  let commandResultAnswerTests = [
    { code: messages.CommandResultAnswer.ResultCodes.OK, message: "OK" },
    {
      code: messages.CommandResultAnswer.ResultCodes.UserCodeNotFound,
      message: "Requesting user code not found",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.NoAccess,
      message: "No access",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.UserDoesNotExist,
      message: "Selected user does not exist",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.UserAlreadyExists,
      message: "Selected user already exists",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.WrongOrAlreadyExistingCode,
      message: "Wrong code or code already exists",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.TelephoneCodeAlreadyExists,
      message: "Telephone code already exists",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.ChangedCodeIsTheSame,
      message: "Changed code is the same",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.OtherError,
      message: "Other error",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.CannotArmButCanForceArm,
      message: "Cannot arm, but can use force arm",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.CannotArm,
      message: "Cannot arm",
    },
    {
      code: messages.CommandResultAnswer.ResultCodes.CommandAccepted,
      message: "Command accepted",
    },
    { code: 0xee, message: "Unknown result code" },
  ];

  commandResultAnswerTests.forEach(function (test) {
    it("decode '" + test.message + "' command result answer", function () {
      const encoder = new Encoder();
      const frame = Buffer.from([
        messages_impl.Commands.CommandResult,
        test.code,
      ]);
      encoder.addBytes(frame);
      const message = messages.decodeMessage(encoder.frame());
      assert.ok(message instanceof messages.CommandResultAnswer);
      assert.strictEqual(message.resultCode, test.code);
      assert.strictEqual(message.resultMessage, test.message);
    });
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
