import fs from 'fs';
import MapReader from './MapReader.mjs';
import { TERRAIN_EMPTY, TILE_SIZE_2X, TILE_SIZE_3X } from './constants.mjs';
import {EDGE_OCCUPIED} from "./constants.mjs";

(async function bootstrap() {
  const [,,file] = process.argv;
  console.info(`Converting file ${file}...`);

  const buffer = fs.readFileSync(file).toString('binary');

  const reader = new MapReader(buffer);
  const { map } = reader;
  console.info(map);
  
  const newMap = {
    name: map.scenario.name,
    description: map.scenario.briefing,
    size: [map.scenario.mapWidth, map.scenario.mapHeight],
    entryPoint: map.scenario.entryPoint,
    exitPoint: map.scenario.exitPoint,
    initialState: {
      funds: map.scenario.startingFunds
    }
  };
  newMap.map = map.terrainInfo.map((terrain, n) => {
    let tile = map.tileId[n];
    const random = map.randomNumbers[n];
    const minimapInfo = map.minimapInfo[n];
    const edge = map.edgeData[n];

    if (!(edge & EDGE_OCCUPIED)) {
      tile = 0;
    }
    return [tile, terrain, random, minimapInfo];
  })
    .filter(([, terrain]) => terrain !== TERRAIN_EMPTY) // обрізати все що виходить за межі карти
  ;

  fs.writeFileSync(`${file}.json`, JSON.stringify(newMap));
})();
