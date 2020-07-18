const Crc = require("./crc");
const Decoder = require("./decoder");
const Encoder = require("./encoder");

const Commands = Object.freeze({
  ZonesViolation: 0x00,
  ZonesTamper: 0x01,
  OutputsState: 0x17,
  NewData: 0x7f,
});

function encodeNoDataCommand(command) {
  const encoder = new Encoder();
  encoder.addByte(command);
  return encoder.frame();
}

module.exports = {
  Commands,
  encodeNoDataCommand,
};
