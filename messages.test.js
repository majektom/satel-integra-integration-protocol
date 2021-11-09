const assert = require("assert");
const Encoder = require("./encoder");
const messages = require("./messages");
const messages_impl = require("./messages_impl");

describe("Message encoding unit tests", function () {
  let noDataCommandTests = [
    {
      func: messages.encodeZonesViolationCommand,
      command: messages_impl.Commands.ZonesViolation,
    },
    {
      func: messages.encodeZonesTamperCommand,
      command: messages_impl.Commands.ZonesTamper,
    },
    {
      func: messages.encodeOutputsStateCommand,
      command: messages_impl.Commands.OutputsState,
    },
    {
      func: messages.encodeNewDataCommand,
      command: messages_impl.Commands.NewData,
    },
    {
      func: messages.encodeZonesAlarmCommand,
      command: messages_impl.Commands.ZonesAlarm,
    },
    {
      func: messages.encodeZonesTamperAlarmCommand,
      command: messages_impl.Commands.ZonesTamperAlarm,
    },
    {
      func: messages.encodeZonesAlarmMemoryCommand,
      command: messages_impl.Commands.ZonesAlarmMemory,
    },
    {
      func: messages.encodeZonesTamperAlarmMemoryCommand,
      command: messages_impl.Commands.ZonesTamperAlarmMemory,
    },
    {
      func: messages.encodeZonesBypassStatusCommand,
      command: messages_impl.Commands.ZonesBypassStatus,
    },
    {
      func: messages.encodeZonesNoViolationTroubleCommand,
      command: messages_impl.Commands.ZonesNoViolationTrouble,
    },
    {
      func: messages.encodeZonesLongViolationTroubleCommand,
      command: messages_impl.Commands.ZonesLongViolationTrouble,
    },
    {
      func: messages.encodeArmedPartitionsSuppressedCommand,
      command: messages_impl.Commands.ArmedPartitionsSuppressed,
    },
    {
      func: messages.encodeArmedPartitionsReallyCommand,
      command: messages_impl.Commands.ArmedPartitionsReally,
    },
    {
      func: messages.encodePartitionsArmedInMode2Command,
      command: messages_impl.Commands.PartitionsArmedInMode2,
    },
    {
      func: messages.encodePartitionsArmedInMode3Command,
      command: messages_impl.Commands.PartitionsArmedInMode3,
    },
    {
      func: messages.encodePartitionsWith1stCodeEnteredCommand,
      command: messages_impl.Commands.PartitionsWith1stCodeEntered,
    },
    {
      func: messages.encodePartitionsEntryTimeCommand,
      command: messages_impl.Commands.PartitionsEntryTime,
    },
    {
      func: messages.encodePartitionsExitTimeMoreThen10sCommand,
      command: messages_impl.Commands.PartitionsExitTimeMoreThen10s,
    },
    {
      func: messages.encodePartitionsExitTimeLessThen10sCommand,
      command: messages_impl.Commands.PartitionsExitTimeLessThen10s,
    },
    {
      func: messages.encodePartitionsTemporaryBlockedCommand,
      command: messages_impl.Commands.PartitionsTemporaryBlocked,
    },
    {
      func: messages.encodePartitionsBlockedForGuardRoundCommand,
      command: messages_impl.Commands.PartitionsBlockedForGuardRound,
    },
    {
      func: messages.encodePartitionsAlarmCommand,
      command: messages_impl.Commands.PartitionsAlarm,
    },
    {
      func: messages.encodePartitionsFireAlarmCommand,
      command: messages_impl.Commands.PartitionsFireAlarm,
    },
    {
      func: messages.encodePartitionsAlarmMemoryCommand,
      command: messages_impl.Commands.PartitionsAlarmMemory,
    },
    {
      func: messages.encodePartitionsFireAlarmMemoryCommand,
      command: messages_impl.Commands.PartitionsFireAlarmMemory,
    },
    {
      func: messages.encodeZonesIsolateStateCommand,
      command: messages_impl.Commands.ZonesIsolateState,
    },
    {
      func: messages.encodeZonesMaskedCommand,
      command: messages_impl.Commands.ZonesMasked,
    },
    {
      func: messages.encodeZonesMaskedMemoryCommand,
      command: messages_impl.Commands.ZonesMaskedMemory,
    },
  ];

  noDataCommandTests.forEach(function (test) {
    it(test.func.name + "()", function () {
      const frame = test.func();
      assert.strictEqual(frame.length, 7);
      assert.strictEqual(frame[2], test.command);
    });
  });
  let noDataCommand256Tests = [
    {
      func: messages.encodeZonesViolation256Command,
      command: messages_impl.Commands.ZonesViolation,
    },
    {
      func: messages.encodeZonesTamper256Command,
      command: messages_impl.Commands.ZonesTamper,
    },
    {
      func: messages.encodeZonesAlarm256Command,
      command: messages_impl.Commands.ZonesAlarm,
    },
    {
      func: messages.encodeZonesTamperAlarm256Command,
      command: messages_impl.Commands.ZonesTamperAlarm,
    },
    {
      func: messages.encodeZonesAlarmMemory256Command,
      command: messages_impl.Commands.ZonesAlarmMemory,
    },
    {
      func: messages.encodeZonesTamperAlarmMemory256Command,
      command: messages_impl.Commands.ZonesTamperAlarmMemory,
    },
    {
      func: messages.encodeZonesBypassStatus256Command,
      command: messages_impl.Commands.ZonesBypassStatus,
    },
    {
      func: messages.encodeZonesNoViolationTrouble256Command,
      command: messages_impl.Commands.ZonesNoViolationTrouble,
    },
    {
      func: messages.encodeZonesLongViolationTrouble256Command,
      command: messages_impl.Commands.ZonesLongViolationTrouble,
    },
    {
      func: messages.encodeOutputsState256Command,
      command: messages_impl.Commands.OutputsState,
    },
    {
      func: messages.encodeZonesIsolateState256Command,
      command: messages_impl.Commands.ZonesIsolateState,
    },
    {
      func: messages.encodeZonesMasked256Command,
      command: messages_impl.Commands.ZonesMasked,
    },
    {
      func: messages.encodeZonesMaskedMemory256Command,
      command: messages_impl.Commands.ZonesMaskedMemory,
    },
  ];

  noDataCommand256Tests.forEach(function (test) {
    it(test.func.name + "()", function () {
      const frame = test.func();
      assert.strictEqual(frame.length, 8);
      assert.strictEqual(frame[2], test.command);
      assert.strictEqual(frame[3], 0x00);
    });
  });

  let outputsAndZonesChangeTests = [
    {
      func: messages.encodeOutputsOnCommand,
      command: messages_impl.Commands.OutputsOn,
    },
    {
      func: messages.encodeOutputsOffCommand,
      command: messages_impl.Commands.OutputsOff,
    },
    {
      func: messages.encodeOutputsSwitchCommand,
      command: messages_impl.Commands.OutputsSwitch,
    },
    {
      func: messages.encodeZonesBypassCommand,
      command: messages_impl.Commands.ZonesBypass,
    },
    {
      func: messages.encodeZonesUnbypassCommand,
      command: messages_impl.Commands.ZonesUnbypass,
    },
    {
      func: messages.encodeZonesIsolateCommand,
      command: messages_impl.Commands.ZonesIsolate,
    },
  ];

  outputsAndZonesChangeTests.forEach(function (test) {
    it(test.func.name + "(), short", function () {
      const outputs = new Array(128).fill(false, 0, 128);
      outputs[0] = true;
      outputs[2] = true;
      outputs[61] = true;
      outputs[119] = true;
      const frame = test.func("0123456789fffFFF", outputs);
      assert(frame.length >= 31);
      assert.strictEqual(frame[2], test.command);
      assert.deepStrictEqual(
        frame.subarray(3, 11),
        Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xff, 0xff, 0xff])
      );
      assert.deepStrictEqual(
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

    it(test.func.name + "(), long", function () {
      const outputs = new Array(256).fill(false, 0, 128);
      outputs[0] = true;
      outputs[2] = true;
      outputs[61] = true;
      outputs[254] = true;
      const frame = test.func("0123456789fffFFF", outputs);
      assert.strictEqual(frame.length, 47);
      assert.strictEqual(frame[2], test.command);
      assert.deepStrictEqual(
        frame.subarray(3, 11),
        Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xff, 0xff, 0xff])
      );
      assert.deepStrictEqual(
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

  let partitionsChangeTests = [
    {
      func: messages.encodeArmInMode0Command,
      command: messages_impl.Commands.ArmInMode0,
    },
    {
      func: messages.encodeArmInMode1Command,
      command: messages_impl.Commands.ArmInMode1,
    },
    {
      func: messages.encodeArmInMode2Command,
      command: messages_impl.Commands.ArmInMode2,
    },
    {
      func: messages.encodeArmInMode3Command,
      command: messages_impl.Commands.ArmInMode3,
    },
    {
      func: messages.encodeDisarmCommand,
      command: messages_impl.Commands.Disarm,
    },
    {
      func: messages.encodeClearAlarmCommand,
      command: messages_impl.Commands.ClearAlarm,
    },
    {
      func: messages.encodeForceArmInMode0Command,
      command: messages_impl.Commands.ForceArmInMode0,
    },
    {
      func: messages.encodeForceArmInMode1Command,
      command: messages_impl.Commands.ForceArmInMode1,
    },
    {
      func: messages.encodeForceArmInMode2Command,
      command: messages_impl.Commands.ForceArmInMode2,
    },
    {
      func: messages.encodeForceArmInMode3Command,
      command: messages_impl.Commands.ForceArmInMode3,
    },
  ];

  partitionsChangeTests.forEach(function (test) {
    it(test.func.name + "()", function () {
      const partitions = new Array(32).fill(false, 0, 32);
      partitions[0] = true;
      partitions[1] = true;
      partitions[28] = true;
      const frame = test.func("0123456789fffFFF", partitions);
      assert(frame.length >= 19);
      assert.strictEqual(frame[2], test.command);
      assert.deepStrictEqual(
        frame.subarray(3, 11),
        Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xff, 0xff, 0xff])
      );
      assert.deepStrictEqual(
        frame.subarray(11, 15),
        Buffer.from([0x03, 0x00, 0x00, 0x10])
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
      message: messages.ZonesViolationAnswer,
      command: messages_impl.Commands.ZonesViolation,
    },
    {
      message: messages.ZonesTamperAnswer,
      command: messages_impl.Commands.ZonesTamper,
    },
    {
      message: messages.OutputsStateAnswer,
      command: messages_impl.Commands.OutputsState,
    },
    {
      message: messages.ZonesAlarmAnswer,
      command: messages_impl.Commands.ZonesAlarm,
    },
    {
      message: messages.ZonesTamperAlarmAnswer,
      command: messages_impl.Commands.ZonesTamperAlarm,
    },
    {
      message: messages.ZonesAlarmMemoryAnswer,
      command: messages_impl.Commands.ZonesAlarmMemory,
    },
    {
      message: messages.ZonesTamperAlarmMemoryAnswer,
      command: messages_impl.Commands.ZonesTamperAlarmMemory,
    },
    {
      message: messages.ZonesBypassStatusAnswer,
      command: messages_impl.Commands.ZonesBypassStatus,
    },
    {
      message: messages.ZonesNoViolationTroubleAnswer,
      command: messages_impl.Commands.ZonesNoViolationTrouble,
    },
    {
      message: messages.ZonesLongViolationTroubleAnswer,
      command: messages_impl.Commands.ZonesLongViolationTrouble,
    },
    {
      message: messages.ZonesIsolateStateAnswer,
      command: messages_impl.Commands.ZonesIsolateState,
    },
    {
      message: messages.ZonesMaskedAnswer,
      command: messages_impl.Commands.ZonesMasked,
    },
    {
      message: messages.ZonesMaskedMemoryAnswer,
      command: messages_impl.Commands.ZonesMaskedMemory,
    },
  ];

  flagArrayAnswerTests.forEach(function (test) {
    it("decode " + test.message.name + ", short", function () {
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

    it("decode " + test.message.name + ", long", function () {
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

  let partitionsFlagArrayAnswerTests = [
    {
      message: messages.ArmedPartitionsSuppressedAnswer,
      command: messages_impl.Commands.ArmedPartitionsSuppressed,
    },
    {
      message: messages.ArmedPartitionsReallyAnswer,
      command: messages_impl.Commands.ArmedPartitionsReally,
    },
    {
      message: messages.PartitionsArmedInMode2Answer,
      command: messages_impl.Commands.PartitionsArmedInMode2,
    },
    {
      message: messages.PartitionsArmedInMode3Answer,
      command: messages_impl.Commands.PartitionsArmedInMode3,
    },
    {
      message: messages.PartitionsWith1stCodeEnteredAnswer,
      command: messages_impl.Commands.PartitionsWith1stCodeEntered,
    },
    {
      message: messages.PartitionsEntryTimeAnswer,
      command: messages_impl.Commands.PartitionsEntryTime,
    },
    {
      message: messages.PartitionsExitTimeMoreThen10sAnswer,
      command: messages_impl.Commands.PartitionsExitTimeMoreThen10s,
    },
    {
      message: messages.PartitionsExitTimeLessThen10sAnswer,
      command: messages_impl.Commands.PartitionsExitTimeLessThen10s,
    },
    {
      message: messages.PartitionsTemporaryBlockedAnswer,
      command: messages_impl.Commands.PartitionsTemporaryBlocked,
    },
    {
      message: messages.PartitionsBlockedForGuardRoundAnswer,
      command: messages_impl.Commands.PartitionsBlockedForGuardRound,
    },
    {
      message: messages.PartitionsAlarmAnswer,
      command: messages_impl.Commands.PartitionsAlarm,
    },
    {
      message: messages.PartitionsFireAlarmAnswer,
      command: messages_impl.Commands.PartitionsFireAlarm,
    },
    {
      message: messages.PartitionsAlarmMemoryAnswer,
      command: messages_impl.Commands.PartitionsAlarmMemory,
    },
    {
      message: messages.PartitionsFireAlarmMemoryAnswer,
      command: messages_impl.Commands.PartitionsFireAlarmMemory,
    },
  ];

  partitionsFlagArrayAnswerTests.forEach(function (test) {
    it("decode " + test.message.name, function () {
      const encoder = new Encoder();
      encoder.addBytes(Buffer.from([test.command].concat(Array(4).fill(0xaa))));
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
    { name: "ZonesViolation", command: messages_impl.Commands.ZonesViolation },
    { name: "ZonesTamper", command: messages_impl.Commands.ZonesTamper },
    { name: "OutputsState", command: messages_impl.Commands.OutputsState },
    { name: "ZonesAlarm", command: messages_impl.Commands.ZonesAlarm },
    {
      name: "ZonesTamperAlarm",
      command: messages_impl.Commands.ZonesTamperAlarm,
    },
    {
      name: "ZonesAlarmMemory",
      command: messages_impl.Commands.ZonesAlarmMemory,
    },
    {
      name: "ZonesTamperAlarmMemory",
      command: messages_impl.Commands.ZonesTamperAlarmMemory,
    },
    {
      name: "ZonesBypassStatus",
      command: messages_impl.Commands.ZonesBypassStatus,
    },
    {
      name: "ZonesNoViolationTrouble",
      command: messages_impl.Commands.ZonesNoViolationTrouble,
    },
    {
      name: "ZonesLongViolationTrouble",
      command: messages_impl.Commands.ZonesLongViolationTrouble,
    },
    {
      name: "ArmedPartitionsSuppressed",
      command: messages_impl.Commands.ArmedPartitionsSuppressed,
    },
    {
      name: "ArmedPartitionsReally",
      command: messages_impl.Commands.ArmedPartitionsReally,
    },
    {
      name: "PartitionsArmedInMode2",
      command: messages_impl.Commands.PartitionsArmedInMode2,
    },
    {
      name: "PartitionsArmedInMode3",
      command: messages_impl.Commands.PartitionsArmedInMode3,
    },
    {
      name: "PartitionsWith1stCodeEntered",
      command: messages_impl.Commands.PartitionsWith1stCodeEntered,
    },
    {
      name: "PartitionsEntryTime",
      command: messages_impl.Commands.PartitionsEntryTime,
    },
    {
      name: "PartitionsExitTimeMoreThen10s",
      command: messages_impl.Commands.PartitionsExitTimeMoreThen10s,
    },
    {
      name: "PartitionsExitTimeLessThen10s",
      command: messages_impl.Commands.PartitionsExitTimeLessThen10s,
    },
    {
      name: "PartitionsTemporaryBlocked",
      command: messages_impl.Commands.PartitionsTemporaryBlocked,
    },
    {
      name: "PartitionsBlockedForGuardRound",
      command: messages_impl.Commands.PartitionsBlockedForGuardRound,
    },
    {
      name: "PartitionsAlarm",
      command: messages_impl.Commands.PartitionsAlarm,
    },
    {
      name: "PartitionsFireAlarm",
      command: messages_impl.Commands.PartitionsFireAlarm,
    },
    {
      name: "PartitionsAlarmMemory",
      command: messages_impl.Commands.PartitionsAlarmMemory,
    },
    {
      name: "PartitionsFireAlarmMemory",
      command: messages_impl.Commands.PartitionsFireAlarmMemory,
    },
    {
      name: "ZonesIsolateState",
      command: messages_impl.Commands.ZonesIsolateState,
    },
    { name: "ZonesMasked", command: messages_impl.Commands.ZonesMasked },
    {
      name: "ZonesMaskedMemory",
      command: messages_impl.Commands.ZonesMaskedMemory,
    },
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
      assert.strictEqual(
        message.zonesAlarmChanged(),
        test.command == messages_impl.Commands.ZonesAlarm
      );
      assert.strictEqual(
        message.zonesTamperAlarmChanged(),
        test.command == messages_impl.Commands.ZonesTamperAlarm
      );
      assert.strictEqual(
        message.zonesAlarmMemoryChanged(),
        test.command == messages_impl.Commands.ZonesAlarmMemory
      );
      assert.strictEqual(
        message.zonesTamperAlarmMemoryChanged(),
        test.command == messages_impl.Commands.ZonesTamperAlarmMemory
      );
      assert.strictEqual(
        message.zonesBypassStatusChanged(),
        test.command == messages_impl.Commands.ZonesBypassStatus
      );
      assert.strictEqual(
        message.zonesNoViolationTroubleChanged(),
        test.command == messages_impl.Commands.ZonesNoViolationTrouble
      );
      assert.strictEqual(
        message.zonesLongViolationTroubleChanged(),
        test.command == messages_impl.Commands.ZonesLongViolationTrouble
      );
      assert.strictEqual(
        message.armedPartitionsSuppressedChanged(),
        test.command == messages_impl.Commands.ArmedPartitionsSuppressed
      );
      assert.strictEqual(
        message.armedPartitionsReallyChanged(),
        test.command == messages_impl.Commands.ArmedPartitionsReally
      );
      assert.strictEqual(
        message.partitionsArmedInMode2Changed(),
        test.command == messages_impl.Commands.PartitionsArmedInMode2
      );
      assert.strictEqual(
        message.partitionsArmedInMode3Changed(),
        test.command == messages_impl.Commands.PartitionsArmedInMode3
      );
      assert.strictEqual(
        message.partitionsWith1stCodeEnteredChanged(),
        test.command == messages_impl.Commands.PartitionsWith1stCodeEntered
      );
      assert.strictEqual(
        message.partitionsEntryTimeChanged(),
        test.command == messages_impl.Commands.PartitionsEntryTime
      );
      assert.strictEqual(
        message.partitionsExitTimeMoreThen10sChanged(),
        test.command == messages_impl.Commands.PartitionsExitTimeMoreThen10s
      );
      assert.strictEqual(
        message.partitionsExitTimeLessThen10sChanged(),
        test.command == messages_impl.Commands.PartitionsExitTimeLessThen10s
      );
      assert.strictEqual(
        message.partitionsTemporaryBlockedChanged(),
        test.command == messages_impl.Commands.PartitionsTemporaryBlocked
      );
      assert.strictEqual(
        message.partitionsBlockedForGuardRoundChanged(),
        test.command == messages_impl.Commands.PartitionsBlockedForGuardRound
      );
      assert.strictEqual(
        message.partitionsAlarmChanged(),
        test.command == messages_impl.Commands.PartitionsAlarm
      );
      assert.strictEqual(
        message.partitionsFireAlarmChanged(),
        test.command == messages_impl.Commands.PartitionsFireAlarm
      );
      assert.strictEqual(
        message.partitionsAlarmMemoryChanged(),
        test.command == messages_impl.Commands.PartitionsAlarmMemory
      );
      assert.strictEqual(
        message.partitionsFireAlarmMemoryChanged(),
        test.command == messages_impl.Commands.PartitionsFireAlarmMemory
      );
      assert.strictEqual(
        message.zonesIsolateStateChanged(),
        test.command == messages_impl.Commands.ZonesIsolateState
      );
      assert.strictEqual(
        message.zonesMaskedChanged(),
        test.command == messages_impl.Commands.ZonesMasked
      );
      assert.strictEqual(
        message.zonesMaskedMemoryChanged(),
        test.command == messages_impl.Commands.ZonesMaskedMemory
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

  it("decode command result answer message of incorrect length", function () {
    const encoder = new Encoder();
    const frame = Buffer.from([
      messages_impl.Commands.CommandResult,
      messages.CommandResultAnswer.ResultCodes.OK,
      0x00,
    ]);
    encoder.addBytes(frame);
    const message = messages.decodeMessage(encoder.frame());
    assert.strictEqual(message, null);
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
