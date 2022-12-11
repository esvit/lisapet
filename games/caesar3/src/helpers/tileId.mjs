const MAP_TILES = {
  245: ['plateau', -200],
  548: ['land1a', -244],
  779: ['land2a', -547],
  871: ['land3a', -778],
  2830: ['housng1a', -2778],
  2872: ['utilitya', -2829],
  3039: ['commerce', -2871],
  3155: ['entertainment', -3038],
  3165: ['govt', -3154],
  3226: ['security', -3164],
  3331: ['transport', -3225],
};
// commerce - 00001 - 00167 - 167
// entertainment - 00001 - 00116 - 116
// plaza - 03139 - 03144 - 6
// security - 00001 - 00061 - 61
// transport - 00001 - 00093 - 93
// utilitya - 00001 - 00057 - 57
// well - 00001 - 00004 - 4

export
function getTileById(tileId) {
  for (const num in MAP_TILES) {
    if (tileId < Number(num)) {
      return [MAP_TILES[num][0], tileId + MAP_TILES[num][1]];
    }
  }
}

export
function getIdByTile([setName, number]) {
  for (const num in MAP_TILES) {
    if (MAP_TILES[num][0] === setName) {
      return number - MAP_TILES[num][1];
    }
  }
}
