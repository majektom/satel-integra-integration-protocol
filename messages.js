const Crc = require("./crc");
const Decoder = require("./decoder");
const Encoder = require("./encoder");

const Commands = Object.freeze({
  ZonesViolation: 0x00,
  ZonesTamper: 0x01,
  OutputsState: 0x17,
  NewData: 0x7f,
});

class NoDataCommand {
  constructor(command) {
    this._command = command;
  }

  encode() {
    const encoder = new Encoder();
    encoder.addByte(this._command);
    return encoder.frame();
  }
}

class ZonesViolationCommand extends NoDataCommand {
  constructor() {
    super(Commands.ZonesViolation);
  }
}

class ZonesTamperCommand extends NoDataCommand {
  constructor() {
    super(Commands.ZonesTamper);
  }
}

class OutputsStateCommand extends NoDataCommand {
  constructor() {
    super(Commands.OutputsState);
  }
}

class NewDataCommand extends NoDataCommand {
  constructor() {
    super(Commands.NewData);
  }
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
    return this._flags[Commands.ZonesViolation];
  }

  zonesTamperChanged() {
    return this._flags[Commands.ZonesTamper];
  }

  outputsStateChanged() {
    return this._flags[Commands.OutputsState];
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
    case Commands.ZonesViolation:
      message = new ZonesViolationAnswer();
      break;
    case Commands.ZonesTamper:
      message = new ZonesTamperAnswer();
      break;
    case Commands.OutputsState:
      message = new OutputsStateAnswer();
      break;
    case Commands.NewData:
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
  NewDataAnswer,
  NewDataCommand,
  OutputsStateAnswer,
  OutputsStateCommand,
  ZonesTamperAnswer,
  ZonesTamperCommand,
  ZonesViolationAnswer,
  ZonesViolationCommand,
  decodeMessage,
};
