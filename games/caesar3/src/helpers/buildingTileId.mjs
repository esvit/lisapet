import {BUILDING_ENGINEERS_POST, BUILDING_HOUSE_VACANT_LOT} from '../constants.mjs';

const MAP_TILES = {
  [BUILDING_HOUSE_VACANT_LOT]: ['housng1a', 45],
  [BUILDING_ENGINEERS_POST]: ['transport', 56],
};

export
function getTileByBuildingId(tileId) {
  return MAP_TILES[tileId];
}

export
function getBuildingIdByTile([setName, number]) {
  const tile = Object.entries(MAP_TILES).find(([, tile]) => tile[0] === setName && tile[1] === number);
  return tile ? tile[0] : null;
}
