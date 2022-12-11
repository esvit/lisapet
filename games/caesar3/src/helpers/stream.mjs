export
class Stream {
  offset = 0;

  constructor(buffer) {
    this.buffer = buffer;
  }

  get length() {
    return this.buffer.length;
  }

  seek(offset) {
    this.offset = offset;
  }

  readByte(length = 1, bigEndian = false) {
    return this.read(1, length, false, bigEndian);
  }

  readShort(length = 1, bigEndian = false) {
    return this.read(2, length, false, bigEndian);
  }

  readInt(length = 1, bigEndian = false) {
    return this.read(4, length, false, bigEndian);
  }

  readChar(length = 1) {
    return this.read(1, length, true);
  }

  read(size, length = 1, isString = false, bigEndian = false) {
    const { buffer, offset } = this;
    let value = length === 1 ? 0 : [];
    const sizeArr = length * size;

    for (let i = 0; i < sizeArr; i += size) {
      const startIndex = bigEndian ? size - 1 : 0;
      const endIndex = bigEndian ? -1 : size;
      const step = bigEndian ? -1 : +1;

      let val = isString ? '' : 0;
      for (let n = startIndex; n !== endIndex; n += step) {
        const position = offset + i + n;
        const char = Array.isArray(buffer) ? buffer[position] : (isString ? buffer.charAt(position) : buffer.charCodeAt(position));
        if (isString) {
          if (char === '\x00') {
            break;
          }
          val += char;
        } else {
          if (Number.isNaN(char)) {
            val = undefined;
            break;
          }
          const pow = !bigEndian ? n : size - n - 1;
          const c = Array.isArray(buffer) ? buffer[position] : buffer.charCodeAt(position);
          val |= c << (8 * pow);
        }
      }
      if (Array.isArray(value)) {
        value.push(val);
      } else {
        value = val;
      }
    }
    if (isString) {
      value = value.join('');
    }
    this.offset += length * size;
    return value;
  }
}

