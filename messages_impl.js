const Crc = require("./crc");
const Decoder = require("./decoder");
const Encoder = require("./encoder");

const Commands = Object.freeze({
  ZonesViolation: 0x00,
  ZonesTamper: 0x01,
  OutputsState: 0x17,
  NewData: 0x7f,
  ZonesBypass: 0x86,
  ZonesUnbypass: 0x87,
  OutputsOn: 0x88,
  OutputsOff: 0x89,
  ZonesIsolate: 0x90,
  OutputsSwitch: 0x91,
  CommandResult: 0xef,
});

function encodeNoDataCommand(command) {
  const encoder = new Encoder();
  encoder.addByte(command);
  return encoder.frame();
}

function prefixAndUserCodeStringToBuffer(prefixAndUserCode) {
  if (
    !(typeof prefixAndUserCode === "string") &&
    !(prefixAndUserCode instanceof String)
  ) {
    throw "'prefixAndUserCode' must be a string";
  }
  if (prefixAndUserCode.length != 16) {
    throw "'prefixAndUserCode' must be exactly 16 characters long";
  }
  const buffer = Buffer.alloc(8, 0);
  for (var i = 0; i < 16; ++i) {
    const c = prefixAndUserCode.charAt(i);
    if ((c < "0" || c > "9") && c != "f" && c != "F") {
      throw "'prefixAndUserCode' must not contain other characters than digits or 'f' or 'F'";
    }
    const bufferIndex = Math.floor(i / 2);
    buffer[bufferIndex] = (buffer[bufferIndex] << 4) | parseInt(c, 16);
  }
  return buffer;
}

function flagsArrayToBuffer(flags) {
  if (!Array.isArray(flags)) {
    throw "'flags' must be an array";
  }
  const flagsLength = 16 * 8;
  const flagsLongLength = 32 * 8;
  if (flags.length != flagsLength && flags.length != flagsLongLength) {
    throw (
      "'flags' array must have " +
      flagsLength +
      " or " +
      flagsLongLength +
      " elements"
    );
  }
  const buffer = Buffer.alloc(flags.length / 8, 0);
  for (var i = 0; i < flags.length; ++i) {
    const flag = flags[i];
    const bufferIndex = Math.floor(i / 8);
    buffer[bufferIndex] = (buffer[bufferIndex] >> 1) | (flag ? 0x80 : 0);
  }
  return buffer;
}

function encodeFlagsArrayWithCodeCommand(command, prefixAndUserCode, flags) {
  const encoder = new Encoder();
  encoder.addByte(command);
  encoder.addBytes(prefixAndUserCodeStringToBuffer(prefixAndUserCode));
  encoder.addBytes(flagsArrayToBuffer(flags));
  return encoder.frame();
}

module.exports = {
  Commands,
  encodeFlagsArrayWithCodeCommand,
  encodeNoDataCommand,
  flagsArrayToBuffer,
  prefixAndUserCodeStringToBuffer,
};
