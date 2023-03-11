import AbstractTool from './AbstractTool.mjs';
import {
    EDGE_OCCUPIED,
    LAYER_TERRAIN,
    TERRAIN_CLEARABLE,
    TERRAIN_NONE, TILE_SIZE_1X,
    TOOLS_SHOVEL
} from '../constants.mjs';
import { getIdByTile } from '../helpers/tileId.mjs';
import Path from "../Path.mjs";

export default class Shovel extends AbstractTool {
    get name() {
        return TOOLS_SHOVEL;
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        if (tile.terrain & TERRAIN_CLEARABLE) {
            const tileRes = layer.getRandomTerrain(tile.random);
            layer.drawTileSprite({ ...tile, tileSize: 1 }, tileRes);
            return true;
        }
    }

    changeCell(map, x, y, { terrain, random }) {
        if (terrain & TERRAIN_CLEARABLE) {
            const tileRes = map.layers[LAYER_TERRAIN].getRandomTerrain(random);
            map.set(x, y, {
                tileId: getIdByTile(tileRes),
                edgeData: EDGE_OCCUPIED,
                minimapInfo: TILE_SIZE_1X,
                terrain: TERRAIN_NONE
            });
        }
    }

    apply(map, [start, end]) {
        if (!start || !end) {
            return;
        }
        const area = new Path(start, end);
        const coordinates = area.getCoordinates();
        for (const [x, y] of coordinates) {
            const tile = map.get(x, y);
            this.changeCell(map, x, y, tile);
        }
    }
}
