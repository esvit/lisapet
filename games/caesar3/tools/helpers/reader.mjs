function readType(funcName) {
  return function(length = 1, bigEndian = false) {
    return function (stream) {
      if (!stream[funcName]) {
        throw new Error(`Unknown type ${funcName}`)
      }
      return stream[funcName](length, bigEndian);
    }
  }
}

export  const STRUCT_TYPES = {
  byte: readType('readByte'),
  char: readType('readChar'),
  short: readType('readShort'),
  int: readType('readInt')
};
