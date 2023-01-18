import AbstractLayer from './AbstractLayer.mjs';
import {
  TERRAIN_ROAD
} from '../constants.mjs';
import Path from '../Path.mjs';
import { getTileById } from '../helpers/tileId.mjs';

export default class BuildingsLayer extends AbstractLayer {
  #buildings = null;
  
  drawBeforeTiles() {
    // робимо об'єкт, щоб було зручніше доступатись до будівень по кординатам у drawTile
    this.#buildings = {};
    for (const build of this.map.state.buildings) {
      this.#buildings[build.x] = this.#buildings[build.x] || {};
      this.#buildings[build.x][build.y] = build;
    }
  }
  
  drawTile(tile) {
    const { mapX, mapY } = tile;
    if (!this.#buildings[mapX] || !this.#buildings[mapX][mapY]) {
      return;
    }
    const building = this.#buildings[mapX][mapY];
    building.draw(this, tile);
  }
}
