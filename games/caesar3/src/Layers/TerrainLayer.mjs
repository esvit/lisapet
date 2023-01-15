import AbstractLayer from './AbstractLayer.mjs';
import {
  TERRAIN_ROAD
} from '../constants.mjs';
import Area from '../Area.mjs';
import { getTileById } from '../helpers/tileId.mjs';

export default class TerrainLayer extends AbstractLayer {
  #selectedZone = null;
  #selectedTool = null;

  drawBeforeTiles() {
    this.#selectedZone = this.map.selectedArea ? new Area(...this.map.selectedArea) : null;
    this.#selectedTool = this.map.selectedAreaTool;
    if (this.#selectedTool && this.#selectedZone) {
      this.#selectedTool.prepareArea(this.map, this.#selectedZone);
    }
  }

  drawTile(tile) {
    const { mapX, mapY, terrain, random } = tile;
    const tileSprite = this.getTile(tile);
    if (!tileSprite) {
      return;
    }
    if (this.#selectedTool && this.#selectedZone && this.#selectedZone.inArea(mapX, mapY)) {
      if (this.#selectedTool.drawPreviewCell(this, mapX, mapY, tile)) {
        return;
      }
    }

    if (terrain & TERRAIN_ROAD) {
      const randTile = this.getRandomTerrain(random);
      this.drawTileSprite(tile, randTile);
    }
    this.drawTileSprite(tile, tileSprite);
  }

  getRandomTerrain(random) {
    return ['land1a', (random % 57) + 62];
  }

  getTile({ tile }) {
    return getTileById(tile);
  }
}
