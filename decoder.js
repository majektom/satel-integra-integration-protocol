const State = Object.freeze({
  AwaitingFirstStartByte: 0,
  AwaitingSecondStartByte: 1,
  AwaitingFirstFrameByte: 2,
  ReceivingFrame: 3,
  EscapeReceived: 4,
  FrameComplete: 5,
});

class Decoder {
  constructor() {
    this._state = State.AwaitingFirstStartByte;
    this._frame = [];
  }

  reset() {
    this._state = State.AwaitingFirstStartByte;
    this._frame = [];
  }

  addByte(byte) {
    switch (this._state) {
      case State.AwaitingFirstStartByte:
        if (byte == 0xfe) {
          this._state = State.AwaitingSecondStartByte;
        }
        break;
      case State.AwaitingSecondStartByte:
        if (byte == 0xfe) {
          this._state = State.AwaitingFirstFrameByte;
        } else {
          this._state = State.AwaitingFirstStartByte;
        }
        break;
      case State.AwaitingFirstFrameByte:
        if (byte != 0xfe) {
          this._state = State.ReceivingFrame;
          this._frame.push(byte);
        }
        break;
      case State.ReceivingFrame:
        if (byte == 0xfe) {
          this._state = State.EscapeReceived;
        } else {
          this._frame.push(byte);
        }
        break;
      case State.EscapeReceived:
        switch (byte) {
          case 0x0d:
            this._state = State.FrameComplete;

            return true;
          case 0xf0:
            this._frame.push(0xfe);
            this._state = State.ReceivingFrame;
            break;
          case 0xfe:
            this.reset();
            this._state = State.AwaitingFirstFrameByte;
            break;
          default:
            this.reset();
            break;
        }
        break;
      case State.FrameComplete:
        this.reset();
        if (byte == 0xfe) {
          this._state = State.AwaitingSecondStartByte;
        }
        break;
    }

    return false;
  }

  frame() {
    return Buffer.from(this._frame);
  }
}

module.exports = Decoder;
