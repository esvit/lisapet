import { Stream } from './stream.mjs';

const BUFFER_SIZE = 4096;

class PKDictionary {
  dictionary = [];
  first = -1;
  size = null;

  constructor(size) {
    this.size = size;
  }

  /**
   * Returns the byte at the specified position.
   * Also does a PUT for this byte since the compression
   * algorithm requires it
   */
  get(position) {
    const index = (this.size + this.first - position) % this.size;
    this.put(this.dictionary[index] || 0);
    return this.dictionary[index] || 0;
  }

  /**
   * Adds a byte to the dictionary
   */
  put(b) {
    this.first = (this.first + 1) % this.size;
    this.dictionary[this.first] = b;
  }
}

export
class PKZipStream {
  buffer = [];
  length = null;
  has_error = false;
  at_end = false;
  eof_reached = false;
  dictionary = null;

  bufOffset = 0;
  bufBit = 0;
  read_offset = 0;
  read_length = 0;
  read_copying = false;

  constructor(buffer) {
    this.stream = new Stream(buffer);
    this.length = this.stream.length;
    this.readHeader();
    if (this.has_error) {
      return;
    }
    this.fillBuffer();
  }

  inflate() {
    const buffer = [];
    while (true) {
      const byte = this.readByte();
      if (byte === false) {
        break;
      }
      buffer.push(byte);
    }
    return buffer;
  }

  readHeader() {
    const size = this.stream.readByte();
    if (size !== 0) {
      throw new Error('Static dictionary not supported');
    }
    this.dictionary_bits = this.stream.readByte();
    let dictSize = 0;
    switch (this.dictionary_bits) {
      case 4: dictSize = 1024; break;
      case 5: dictSize = 2048; break;
      case 6: dictSize = 4096; break;
      default: throw new Error('Unknown dictionary size');
    }
    this.dictionary = new PKDictionary(dictSize);
    this.length -= 2;
    this.bufOffset = 0;
    this.eof_reached = true;
    this.eof_position = this.length;
  }

  read() {
    if (this.read_copying) {
      this.read_length--;
      if (this.read_length <= 0) {
        this.read_copying = false;
      }
      return this.dictionary.get(this.read_offset);
    } else {
      if (this.readBit() === 0) {
        // Copy byte verbatim
        const result = this.readBits(8);
        this.dictionary.put(result);
        return result;
      }
      // Needs to copy stuff from the dictionary
      this.read_length = this.getCopyLength();
      if (this.read_length >= 519) {
        this.has_error = this.at_end = true;
        return false;
      }

      this.read_offset = this.getCopyOffset(this.read_length);
      this.read_length--;
      this.read_copying = true;
      return this.dictionary.get(this.read_offset);
    }
  }

  readBit() {
    if (this.bufBit === 8) {
      this.advanceByte();
    }
    let b = (this.buffer[this.bufOffset] >> this.bufBit) & 1;
    this.bufBit++;
    return b;
  }

  advanceByte() {
    this.bufOffset++;
    if (this.eof_reached && this.bufOffset >= this.eof_position) {
      throw new Error('Unexpected EOF');
      // return;
    }
    if (this.bufOffset >= BUFFER_SIZE) {
      this.fillBuffer();
    }
    this.bufBit = 0;
  }

  readBits(length) {
    let result;
    if (this.bufBit === 8) {
      this.advanceByte();
    }
    // Check to see if we span multiple bytes
    if (this.bufBit + length > 8) {
      // First take last remaining bits in this byte & put them in place
      // Do "& 0xff" to prevent a negative character from filling with ff's
      result = ((this.buffer[this.bufOffset] & 0xff) >> this.bufBit);
      let length1 = 8 - this.bufBit;
      let length2 = length - length1;
      this.advanceByte();

      // Read length2 bits from the second byte & add them to the result
      result |= ((this.buffer[this.bufOffset]) & ((1 << length2) - 1)) << length1;
      this.bufBit = length2;
    } else {
      // Same byte, easy!
      result = (this.buffer[this.bufOffset] >> this.bufBit) & ((1 << length) - 1);
      this.bufBit += length;
    }
    return result;
  }

  fillBuffer() {
    this.bufOffset = 0;
    if (this.length <= BUFFER_SIZE) {
      this.buffer = this.stream.readByte(this.length);
      this.eof_reached = true;
      this.eof_position = this.length;
    } else {
      this.buffer = this.stream.readByte(BUFFER_SIZE);
      this.length -= BUFFER_SIZE;
    }
  }

  /**
   * Gets the amount of bytes to copy from the dictionary
   */
  getCopyLength() {
    let bits;

    bits = this.readBits(2);
    if (bits === 3) { // 11
      return 3;
    } else if (bits === 1) { // 10x
      return 4 - 2 * this.readBit();
    } else if (bits === 2) { // 01
      if (this.readBit() === 1) { // 011
        return 5;
      } else { // 010x
        return 7 - this.readBit();
      }
    } else if (bits === 0) { // 00
      bits = this.readBits(2);
      if (bits === 3) { // 0011
        return 8;
      } else if (bits === 1) { // 0010
        if (this.readBit() === 1) { // 00101
          return 9;
        } else { // 00100x
          return 10 + this.readBit();
        }
      } else if (bits === 2) { // 0001
        if (this.readBit() === 1) { // 00011xx
          return 12 + this.readBits(2);
        } else { // 00010xxx
          return 16 + this.readBits(3);
        }
      } else if (bits === 0) { // 0000
        bits = this.readBits(2);
        switch (bits) {
          case 3: return 24 + this.readBits(4); // 000011xxxx
          case 1: return 40 + this.readBits(5); // 000010xxxxx
          case 2: return 72 + this.readBits(6); // 000001xxxxxx
          case 0:
            if (this.readBit()) {
              return 136 + this.readBits(7); // 0000001xxxxxxx
            } else {
              return 264 + this.readBits(8); // 0000000xxxxxxxx
            }
        }
      }
    }
    // Cannot happen
    return -1;
  }

  /**
   * Gets the offset at which to start copying bytes from the dictionary
   */
  getCopyOffset(length) {
    let lower_bits, result;
    if (length === 2) {
      lower_bits = 2;
    } else {
      lower_bits = this.dictionary_bits;
    }

    result = this.getCopyOffsetHigh() << lower_bits;
    result |= this.readBits(lower_bits);
    return result;
  }

  /**
   * Gets the "high" value of the copy offset, the lower N bits
   * are stored verbatim; N depends on the copy length and the
   * dictionary size.
   */
  getCopyOffsetHigh() {
    let bits;

    bits = this.readBits(2);
    if (bits === 3) { // 11
      return 0;
    } else if (bits === 1) { // 10
      bits = this.readBits(2);
      switch (bits) {
        case 0: return 0x6 - this.readBit(); // 1000x
        case 1: return 0x2; // 1010
        case 2: return 0x4 - this.readBit(); // 1001x
        case 3: return 0x1; // 1011
      }
    } else if (bits === 2) { // 01
      bits = this.readBits(4);
      if (bits === 0) {
        return 0x17 - this.readBit();
      } else {
        return 0x16 - this.reverse(bits, 4);
      }
    } else if (bits === 0) { // 00
      bits = this.readBits(2);
      switch (bits) {
        case 3: return 0x1f - this.reverse(this.readBits(3), 3);
        case 1: return 0x27 - this.reverse(this.readBits(3), 3);
        case 2: return 0x2f - this.reverse(this.readBits(3), 3);
        case 0: return 0x3f - this.reverse(this.readBits(4), 4);
      }
    }
    // Cannot happen
    return -1;
  }

  /**
   * Reverse the bits in `number', essentially converting it from little
   * endian to big endian or vice versa.
   */
  reverse(number, length) {
    if (length === 3) {
      switch (number) {
        case 1: return 4;
        case 3: return 6;
        case 4: return 1;
        case 6: return 3;
        default: return number;
      }
    } else if (length === 4) {
      switch (number) {
        case 1: return 8;
        case 2: return 4;
        case 3: return 12;
        case 4: return 2;
        case 5: return 10;
        case 7: return 14;
        case 8: return 1;
        case 10: return 5;
        case 11: return 13;
        case 12: return 3;
        case 13: return 11;
        case 14: return 7;
        default: return number;
      }
    }
    return number;
  }

  readByte() {
    return this.read();
  }

  readShort() {
    return this.read() + (this.read() << 8);
  }

  readInt() {
    return this.read() + (this.read() << 8) + (this.read() << 16) + (this.read() << 24);
  }
}

export
class PKStream extends Stream {
  skipCompressed() {
    const length = this.readInt();
    this.seek(this.offset + length);
  }

  getCompressedStream() {
    const length = this.readInt();
    return new PKZipStream(this.readByte(length));
  }

  readCompressed(size = 1) {
    const pkStream = this.getCompressedStream();
    const buffer = [];
    while (true) {
      try {
        let byte;
        switch (size) {
          case 1: byte = pkStream.readByte(); break;
          case 2: byte = pkStream.readShort(); break;
          case 4: byte = pkStream.readInt(); break;
        }
        if (byte === false) {
          break;
        }
        buffer.push(byte);
      } catch (err) {
        break;
      }
    }
    return buffer;
  }

  readCompressedBytes() {
    return this.readCompressed(1);
  }

  readCompressedShorts() {
    return this.readCompressed(2);
  }

  readCompressedInts() {
    return this.readCompressed(4);
  }
}
