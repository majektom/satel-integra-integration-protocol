const assert = require("assert");
const expect = require("chai").expect;
const Encoder = require("./encoder");
const messages_impl = require("./messages_impl");

describe("Messages private implementation unit tests", function () {
  it("prefixAndUserCodeStringToBuffer", function () {
    expect(
      messages_impl.prefixAndUserCodeStringToBuffer("0123456789fffFFF")
    ).to.be.deep.equal(
      Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xff, 0xff, 0xff])
    );
  });

  it("prefixAndUserCodeStringToBuffer, not a string", function () {
    const prefixAndUserCodeStringToBuffer =
      messages_impl.prefixAndUserCodeStringToBuffer;
    expect(
      prefixAndUserCodeStringToBuffer.bind(prefixAndUserCodeStringToBuffer, 42)
    ).to.throw(RegExp("must be a string"));
    expect(
      prefixAndUserCodeStringToBuffer.bind(prefixAndUserCodeStringToBuffer, {
        code: "0123456789012345",
      })
    ).to.throw(RegExp("must be a string"));
    expect(
      prefixAndUserCodeStringToBuffer.bind(prefixAndUserCodeStringToBuffer, [
        0x01,
        0x23,
        0x45,
        0x67,
        0x89,
        0x01,
        0x23,
        0x45,
      ])
    ).to.throw(RegExp("must be a string"));
    expect(
      prefixAndUserCodeStringToBuffer.bind(
        prefixAndUserCodeStringToBuffer,
        true
      )
    ).to.throw(RegExp("must be a string"));
    expect(
      prefixAndUserCodeStringToBuffer.bind(
        prefixAndUserCodeStringToBuffer,
        null
      )
    ).to.throw(RegExp("must be a string"));
  });

  it("prefixAndUserCodeStringToBuffer, wrong length", function () {
    const prefixAndUserCodeStringToBuffer =
      messages_impl.prefixAndUserCodeStringToBuffer;
    expect(
      prefixAndUserCodeStringToBuffer.bind(
        prefixAndUserCodeStringToBuffer,
        "012345678901234"
      )
    ).to.throw(RegExp("must be exactly 16 characters long"));
    expect(
      prefixAndUserCodeStringToBuffer.bind(
        prefixAndUserCodeStringToBuffer,
        "01234567890123456"
      )
    ).to.throw(RegExp("must be exactly 16 characters long"));
  });

  it("prefixAndUserCodeStringToBuffer, disallowed character", function () {
    const prefixAndUserCodeStringToBuffer =
      messages_impl.prefixAndUserCodeStringToBuffer;
    expect(
      prefixAndUserCodeStringToBuffer.bind(
        prefixAndUserCodeStringToBuffer,
        "012345678901234G"
      )
    ).to.throw(
      RegExp("must not contain other characters than digits or 'f' or 'F'")
    );
  });

  let flagsArrayToBufferTests = [
    {
      name: "short",
      length: 128,
    },
    {
      name: "long",
      length: 256,
    },
  ];

  flagsArrayToBufferTests.forEach(function (test) {
    it("flagsArrayToBuffer, " + test.name + " array", function () {
      const array = new Array(test.length).fill(false);
      for (let i = 1; i < array.length; i += 2) {
        array[i] = true;
      }
      expect(messages_impl.flagsArrayToBuffer(array)).to.deep.equal(
        Buffer.alloc(test.length / 8, 0xaa)
      );
    });
  });

  it("flagsArrayToBuffer, not an array", function () {
    const flagsArrayToBuffer = messages_impl.flagsArrayToBuffer;
    expect(flagsArrayToBuffer.bind(flagsArrayToBuffer, 42)).to.throw(
      RegExp("must be an array")
    );
    expect(
      flagsArrayToBuffer.bind(flagsArrayToBuffer, {
        code: "0123456789012345",
      })
    ).to.throw(RegExp("must be an array"));
    expect(flagsArrayToBuffer.bind(flagsArrayToBuffer, "11110001111")).to.throw(
      RegExp("must be an array")
    );
    expect(flagsArrayToBuffer.bind(flagsArrayToBuffer, true)).to.throw(
      RegExp("must be an array")
    );
    expect(flagsArrayToBuffer.bind(flagsArrayToBuffer, null)).to.throw(
      RegExp("must be an array")
    );
  });

  it("flagsArrayToBuffer, wrong length", function () {
    const flagsArrayToBuffer = messages_impl.flagsArrayToBuffer;
    expect(flagsArrayToBuffer.bind(flagsArrayToBuffer, Array(127))).to.throw(
      RegExp("must have 128 or 256 elements")
    );
    expect(flagsArrayToBuffer.bind(flagsArrayToBuffer, Array(255))).to.throw(
      RegExp("must have 128 or 256 elements")
    );
  });
});
