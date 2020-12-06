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

function encodeZonesAlarmCommand() {
  return message_impl.encodeNoDataCommand(message_impl.Commands.ZonesAlarm);
}

function encodeZonesTamperAlarmCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesTamperAlarm
  );
}

function encodeZonesAlarmMemoryCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesAlarmMemory
  );
}

function encodeZonesTamperAlarmMemoryCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesTamperAlarmMemory
  );
}

function encodeZonesBypassStatusCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesBypassStatus
  );
}

function encodeZonesNoViolationTroubleCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesNoViolationTrouble
  );
}

function encodeZonesLongViolationTroubleCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesLongViolationTrouble
  );
}

function encodeZonesIsolateStateCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesIsolateState
  );
}

function encodeZonesMaskedCommand() {
  return message_impl.encodeNoDataCommand(message_impl.Commands.ZonesMasked);
}

function encodeZonesMaskedMemoryCommand() {
  return message_impl.encodeNoDataCommand(
    message_impl.Commands.ZonesMaskedMemory
  );
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
  constructor(allowedLengths) {
    this._allowedLengths = allowedLengths;
    this._flags = [];
  }

  decode(frame) {
    if (
      this._allowedLengths.every(function (allowedLength) {
        return allowedLength != frame.length;
      })
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
    super([16, 32]);
  }
}

class ZonesTamperAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class OutputsStateAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesAlarmAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesTamperAlarmAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesAlarmMemoryAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesTamperAlarmMemoryAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesBypassStatusAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesNoViolationTroubleAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesLongViolationTroubleAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesIsolateStateAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesMaskedAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class ZonesMaskedMemoryAnswer extends FlagArrayAnswer {
  constructor() {
    super([16, 32]);
  }
}

class NewDataAnswer extends FlagArrayAnswer {
  constructor() {
    super([5, 6, 7]);
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

  zonesAlarmChanged() {
    return this._flags[message_impl.Commands.ZonesAlarm];
  }

  zonesTamperAlarmChanged() {
    return this._flags[message_impl.Commands.ZonesTamperAlarm];
  }

  zonesAlarmMemoryChanged() {
    return this._flags[message_impl.Commands.ZonesAlarmMemory];
  }

  zonesTamperAlarmMemoryChanged() {
    return this._flags[message_impl.Commands.ZonesTamperAlarmMemory];
  }

  zonesBypassStatusChanged() {
    return this._flags[message_impl.Commands.ZonesBypassStatus];
  }

  zonesNoViolationTroubleChanged() {
    return this._flags[message_impl.Commands.ZonesNoViolationTrouble];
  }

  zonesLongViolationTroubleChanged() {
    return this._flags[message_impl.Commands.ZonesLongViolationTrouble];
  }

  zonesIsolateStateChanged() {
    return this._flags[message_impl.Commands.ZonesIsolateState];
  }

  zonesMaskedChanged() {
    return this._flags[message_impl.Commands.ZonesMasked];
  }

  zonesMaskedMemoryChanged() {
    return this._flags[message_impl.Commands.ZonesMaskedMemory];
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
    case message_impl.Commands.ZonesAlarm:
      message = new ZonesAlarmAnswer();
      break;
    case message_impl.Commands.ZonesTamperAlarm:
      message = new ZonesTamperAlarmAnswer();
      break;
    case message_impl.Commands.ZonesAlarmMemory:
      message = new ZonesAlarmMemoryAnswer();
      break;
    case message_impl.Commands.ZonesTamperAlarmMemory:
      message = new ZonesTamperAlarmMemoryAnswer();
      break;
    case message_impl.Commands.ZonesBypassStatus:
      message = new ZonesBypassStatusAnswer();
      break;
    case message_impl.Commands.ZonesNoViolationTrouble:
      message = new ZonesNoViolationTroubleAnswer();
      break;
    case message_impl.Commands.ZonesLongViolationTrouble:
      message = new ZonesLongViolationTroubleAnswer();
      break;
    case message_impl.Commands.ZonesIsolateState:
      message = new ZonesIsolateStateAnswer();
      break;
    case message_impl.Commands.ZonesMasked:
      message = new ZonesMaskedAnswer();
      break;
    case message_impl.Commands.ZonesMaskedMemory:
      message = new ZonesMaskedMemoryAnswer();
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
  encodeZonesAlarmCommand,
  encodeZonesAlarmMemoryCommand,
  encodeZonesBypassCommand,
  encodeZonesBypassStatusCommand,
  encodeZonesIsolateCommand,
  encodeZonesIsolateStateCommand,
  encodeZonesLongViolationTroubleCommand,
  encodeZonesMaskedCommand,
  encodeZonesMaskedMemoryCommand,
  encodeZonesNoViolationTroubleCommand,
  encodeZonesTamperAlarmCommand,
  encodeZonesTamperAlarmMemoryCommand,
  encodeZonesTamperCommand,
  encodeZonesUnbypassCommand,
  encodeZonesViolationCommand,
  CommandResultAnswer,
  NewDataAnswer,
  OutputsStateAnswer,
  ZonesAlarmAnswer,
  ZonesAlarmMemoryAnswer,
  ZonesBypassStatusAnswer,
  ZonesIsolateStateAnswer,
  ZonesLongViolationTroubleAnswer,
  ZonesMaskedAnswer,
  ZonesMaskedMemoryAnswer,
  ZonesNoViolationTroubleAnswer,
  ZonesTamperAlarmAnswer,
  ZonesTamperAlarmMemoryAnswer,
  ZonesTamperAnswer,
  ZonesViolationAnswer,
};
