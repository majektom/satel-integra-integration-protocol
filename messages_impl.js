const Crc = require("./crc");
const Decoder = require("./decoder");
const Encoder = require("./encoder");

const Commands = Object.freeze({
  ZonesViolation: 0x00,
  ZonesTamper: 0x01,
  OutputsState: 0x17,
  NewData: 0x7f,
  OutputsOn: 0x88,
  OutputsOff: 0x89,
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

function outputsArrayToBuffer(outputs) {
  if (!Array.isArray(outputs)) {
    throw "'outputs' must be an array";
  }
  const outputsLength = 16 * 8;
  const outputsLongLength = 32 * 8;
  if (outputs.length != outputsLength && outputs.length != outputsLongLength) {
    throw (
      "'outputs' array must have " +
      outputsLength +
      " or " +
      outputsLongLength +
      " elements"
    );
  }
  const buffer = Buffer.alloc(outputs.length / 8, 0);
  for (var i = 0; i < outputs.length; ++i) {
    const flag = outputs[i];
    const bufferIndex = Math.floor(i / 8);
    buffer[bufferIndex] = (buffer[bufferIndex] >> 1) | (flag ? 0x80 : 0);
  }
  return buffer;
}

function encodeChangeOutputsCommand(command, prefixAndUserCode, outputs) {
  const encoder = new Encoder();
  encoder.addByte(command);
  encoder.addBytes(prefixAndUserCodeStringToBuffer(prefixAndUserCode));
  encoder.addBytes(outputsArrayToBuffer(outputs));
  return encoder.frame();
}

module.exports = {
  Commands,
  encodeChangeOutputsCommand,
  encodeNoDataCommand,
  outputsArrayToBuffer,
  prefixAndUserCodeStringToBuffer,
};
