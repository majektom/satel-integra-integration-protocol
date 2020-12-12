const Crc = require("./crc");
const Decoder = require("./decoder");
const Encoder = require("./encoder");

const Commands = Object.freeze({
  ZonesViolation: 0x00,
  ZonesTamper: 0x01,
  ZonesAlarm: 0x02,
  ZonesTamperAlarm: 0x03,
  ZonesAlarmMemory: 0x04,
  ZonesTamperAlarmMemory: 0x05,
  ZonesBypassStatus: 0x06,
  ZonesNoViolationTrouble: 0x07,
  ZonesLongViolationTrouble: 0x08,
  ArmedPartitionsSuppressed: 0x09,
  ArmedPartitionsReally: 0x0a,
  PartitionsArmedInMode2: 0x0b,
  PartitionsArmedInMode3: 0x0c,
  PartitionsWith1stCodeEntered: 0x0d,
  PartitionsEntryTime: 0x0e,
  PartitionsExitTimeMoreThen10s: 0x0f,
  PartitionsExitTimeLessThen10s: 0x10,
  PartitionsTemporaryBlocked: 0x11,
  PartitionsBlockedForGuardRound: 0x12,
  PartitionsAlarm: 0x13,
  PartitionsFireAlarm: 0x14,
  PartitionsAlarmMemory: 0x15,
  PartitionsFireAlarmMemory: 0x16,
  OutputsState: 0x17,
  ZonesIsolateState: 0x26,
  ZonesMasked: 0x28,
  ZonesMaskedMemory: 0x29,
  NewData: 0x7f,
  ArmInMode0: 0x80,
  ArmInMode1: 0x81,
  ArmInMode2: 0x82,
  ArmInMode3: 0x83,
  Disarm: 0x84,
  ClearAlarm: 0x85,
  ZonesBypass: 0x86,
  ZonesUnbypass: 0x87,
  OutputsOn: 0x88,
  OutputsOff: 0x89,
  ZonesIsolate: 0x90,
  OutputsSwitch: 0x91,
  ForceArmInMode0: 0xa0,
  ForceArmInMode1: 0xa1,
  ForceArmInMode2: 0xa2,
  ForceArmInMode3: 0xa3,
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

function flagsArrayToBuffer(flags, name, validLengths) {
  if (!Array.isArray(flags)) {
    throw "'" + name + "' must be an array";
  }
  if (
    validLengths.every(function (validLength) {
      return validLength != flags.length;
    })
  ) {
    throw (
      "'" +
      name +
      "' array must have " +
      validLengths.reduce(function (prev, curr) {
        return "" + prev + " or " + curr;
      }) +
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

function encodeFlagsArrayWithCodeCommand(
  command,
  prefixAndUserCode,
  flags,
  name,
  validLengths
) {
  const encoder = new Encoder();
  encoder.addByte(command);
  encoder.addBytes(prefixAndUserCodeStringToBuffer(prefixAndUserCode));
  encoder.addBytes(flagsArrayToBuffer(flags, name, validLengths));
  return encoder.frame();
}

module.exports = {
  Commands,
  encodeFlagsArrayWithCodeCommand,
  encodeNoDataCommand,
  flagsArrayToBuffer,
  prefixAndUserCodeStringToBuffer,
};
