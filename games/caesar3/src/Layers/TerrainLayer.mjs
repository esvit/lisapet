import AbstractLayer from './AbstractLayer.mjs';
import {
  EDGE_OCCUPIED, TERRAIN_ROAD
} from '../constants.mjs';
import Area from '../Area.mjs';
import { getTileById } from '../helpers/tileId.mjs';

export default class TerrainLayer extends AbstractLayer {
  drawLayer() {
    const selectedZone = this.map.selectedArea ? new Area(...this.map.selectedArea) : null;
    const tiles = this.map.getTiles();
    const tool = this.map.selectedAreaTool;
    if (tool && selectedZone) {
      tool.prepareArea(this.map, selectedZone);
    }
    for (const tile of tiles) {
      const { mapX, mapY, edge, terrain, random } = tile;
      const tileSprite = this.getTile(tile);
      if (!tileSprite) {
        continue;
      }
      if (tool && selectedZone && selectedZone.inArea(mapX, mapY)) {
        if (tool.drawPreviewCell(this, mapX, mapY, tile)) {
          continue;
        }
      }

      if (edge & EDGE_OCCUPIED) {
        if (terrain & TERRAIN_ROAD) {
          const randTile = this.getRandomTerrain(random);
          this.drawTile(tile, randTile);
        }
        this.drawTile(tile, tileSprite);
      }
    }
  }

  getRandomTerrain(random) {
    return ['land1a', (random % 57) + 62];
  }

  getTile({ tile }) {
    return getTileById(tile);
  }
}
