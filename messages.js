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
  return message_impl.encodeChangeOutputsCommand(
    message_impl.Commands.OutputsOn,
    prefixAndUserCode,
    outputs
  );
}

function encodeOutputsOffCommand(prefixAndUserCode, outputs) {
  return message_impl.encodeChangeOutputsCommand(
    message_impl.Commands.OutputsOff,
    prefixAndUserCode,
    outputs
  );
}

function encodeOutputsSwitchCommand(prefixAndUserCode, outputs) {
  return message_impl.encodeChangeOutputsCommand(
    message_impl.Commands.OutputsSwitch,
    prefixAndUserCode,
    outputs
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
  encodeZonesTamperCommand,
  encodeZonesViolationCommand,
  NewDataAnswer,
  OutputsStateAnswer,
  ZonesTamperAnswer,
  ZonesViolationAnswer,
};
