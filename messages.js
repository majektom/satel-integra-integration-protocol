const Crc = require("./crc");
const Decoder = require("./decoder");
const Encoder = require("./encoder");
const message_impl = require("./messages_impl");

function encodeZonesViolationCommand() {
  return message_impl.encodeNoDataCommand(message_impl.Commands.ZonesViolation);
}

function encodeZonesTamperCommand() {
  return message_impl.encodeNoDataCommand(message_impl.Commands.ZonesTamper);
}

function encodeOutputsStateCommand() {
  return message_impl.encodeNoDataCommand(message_impl.Commands.OutputsState);
}

function encodeNewDataCommand() {
  return message_impl.encodeNoDataCommand(message_impl.Commands.NewData);
}

function encodeOutputsOnCommand(prefixAndUserCode, outputs) {
  return message_impl.encodeFlagsArrayWithCodeCommand(
    message_impl.Commands.OutputsOn,
    prefixAndUserCode,
    outputs
  );
}

function encodeOutputsOffCommand(prefixAndUserCode, outputs) {
  return message_impl.encodeFlagsArrayWithCodeCommand(
    message_impl.Commands.OutputsOff,
    prefixAndUserCode,
    outputs
  );
}

function encodeOutputsSwitchCommand(prefixAndUserCode, outputs) {
  return message_impl.encodeFlagsArrayWithCodeCommand(
    message_impl.Commands.OutputsSwitch,
    prefixAndUserCode,
    outputs
  );
}

function encodeZonesBypassCommand(prefixAndUserCode, zones) {
  return message_impl.encodeFlagsArrayWithCodeCommand(
    message_impl.Commands.ZonesBypass,
    prefixAndUserCode,
    zones
  );
}

function encodeZonesUnbypassCommand(prefixAndUserCode, zones) {
  return message_impl.encodeFlagsArrayWithCodeCommand(
    message_impl.Commands.ZonesUnbypass,
    prefixAndUserCode,
    zones
  );
}

function encodeZonesIsolateCommand(prefixAndUserCode, zones) {
  return message_impl.encodeFlagsArrayWithCodeCommand(
    message_impl.Commands.ZonesIsolate,
    prefixAndUserCode,
    zones
  );
}

class FlagArrayAnswer {
  constructor(length, longLength = undefined) {
    this._length = length;
    this._longLength = longLength;
    this._flags = [];
  }

  decode(frame) {
    if (
      frame.length != this._length &&
      typeof this._longLength != undefined &&
      frame.length != this._longLength
    ) {
      return false;
    }

    this._flags = new Array();
    for (const byte of frame) {
      for (let i = 0; i < 8; ++i) {
        this._flags.push((byte & (1 << i)) != 0);
      }
    }

    return true;
  }

  get flags() {
    return [...this._flags];
  }
}

class ZonesViolationAnswer extends FlagArrayAnswer {
  constructor() {
    super(16, 32);
  }
}

class ZonesTamperAnswer extends FlagArrayAnswer {
  constructor() {
    super(16, 32);
  }
}

class OutputsStateAnswer extends FlagArrayAnswer {
  constructor() {
    super(16, 32);
  }
}

class NewDataAnswer extends FlagArrayAnswer {
  constructor() {
    super(5);
  }

  zonesViolationChanged() {
    return this._flags[message_impl.Commands.ZonesViolation];
  }

  zonesTamperChanged() {
    return this._flags[message_impl.Commands.ZonesTamper];
  }

  outputsStateChanged() {
    return this._flags[message_impl.Commands.OutputsState];
  }
}

class CommandResultAnswer {
  decode(frame) {
    if (frame.length != 1) {
      return false;
    }
    this._resultCode = frame[0];
    switch (this._resultCode) {
      case CommandResultAnswer.ResultCodes.OK:
        this._resultMessage = "OK";
        break;
      case CommandResultAnswer.ResultCodes.UserCodeNotFound:
        this._resultMessage = "Requesting user code not found";
        break;
      case CommandResultAnswer.ResultCodes.NoAccess:
        this._resultMessage = "No access";
        break;
      case CommandResultAnswer.ResultCodes.UserDoesNotExist:
        this._resultMessage = "Selected user does not exist";
        break;
      case CommandResultAnswer.ResultCodes.UserAlreadyExists:
        this._resultMessage = "Selected user already exists";
        break;
      case CommandResultAnswer.ResultCodes.WrongOrAlreadyExistingCode:
        this._resultMessage = "Wrong code or code already exists";
        break;
      case CommandResultAnswer.ResultCodes.TelephoneCodeAlreadyExists:
        this._resultMessage = "Telephone code already exists";
        break;
      case CommandResultAnswer.ResultCodes.ChangedCodeIsTheSame:
        this._resultMessage = "Changed code is the same";
        break;
      case CommandResultAnswer.ResultCodes.OtherError:
        this._resultMessage = "Other error";
        break;
      case CommandResultAnswer.ResultCodes.CannotArmButCanForceArm:
        this._resultMessage = "Cannot arm, but can use force arm";
        break;
      case CommandResultAnswer.ResultCodes.CannotArm:
        this._resultMessage = "Cannot arm";
        break;
      case CommandResultAnswer.ResultCodes.CommandAccepted:
        this._resultMessage = "Command accepted";
        break;
      default:
        this._resultMessage = "Unknown result code";
        break;
    }
    return true;
  }

  get resultCode() {
    return this._resultCode;
  }

  get resultMessage() {
    return this._resultMessage;
  }
}

CommandResultAnswer.ResultCodes = Object.freeze({
  OK: 0x00,
  UserCodeNotFound: 0x01,
  NoAccess: 0x02,
  UserDoesNotExist: 0x03,
  UserAlreadyExists: 0x04,
  WrongOrAlreadyExistingCode: 0x05,
  TelephoneCodeAlreadyExists: 0x06,
  ChangedCodeIsTheSame: 0x07,
  OtherError: 0x08,
  CannotArmButCanForceArm: 0x11,
  CannotArm: 0x12,
  CommandAccepted: 0xff,
});

function decodeMessage(frame) {
  const decoder = new Decoder();
  let decoded = false;
  for (const b of frame.values()) {
    if (decoder.addByte(b)) {
      decoded = true;
      break;
    }
  }

  if (!decoded) {
    return null;
  }

  const decodedFrame = decoder.frame();

  if (decodedFrame.length < 3) {
    return null;
  }

  const crc = new Crc();
  crc.addBytes(decodedFrame.subarray(0, decodedFrame.length - 2));

  if (
    crc.crc !=
    ((decodedFrame[decodedFrame.length - 2] << 8) |
      decodedFrame[decodedFrame.length - 1])
  ) {
    return null;
  }

  let message;
  switch (decodedFrame[0]) {
    case message_impl.Commands.ZonesViolation:
      message = new ZonesViolationAnswer();
      break;
    case message_impl.Commands.ZonesTamper:
      message = new ZonesTamperAnswer();
      break;
    case message_impl.Commands.OutputsState:
      message = new OutputsStateAnswer();
      break;
    case message_impl.Commands.NewData:
      message = new NewDataAnswer();
      break;
    case message_impl.Commands.CommandResult:
      message = new CommandResultAnswer();
      break;
    default:
      return null;
  }

  if (message.decode(decodedFrame.subarray(1, decodedFrame.length - 2))) {
    return message;
  }

  return null;
}

module.exports = {
  decodeMessage,
  encodeNewDataCommand,
  encodeOutputsOffCommand,
  encodeOutputsOnCommand,
  encodeOutputsStateCommand,
  encodeOutputsSwitchCommand,
  encodeZonesBypassCommand,
  encodeZonesIsolateCommand,
  encodeZonesTamperCommand,
  encodeZonesUnbypassCommand,
  encodeZonesViolationCommand,
  CommandResultAnswer,
  NewDataAnswer,
  OutputsStateAnswer,
  ZonesTamperAnswer,
  ZonesViolationAnswer,
};
