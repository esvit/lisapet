import AbstractTool from './AbstractTool.mjs';
import {
    EDGE_OCCUPIED,
    LAYER_TERRAIN,
    TERRAIN_CLEARABLE,
    TERRAIN_NONE, TILE_SIZE_1X,
    TOOLS_SHOVEL
} from '../constants.mjs';
import { getIdByTile } from '../helpers/tileId.mjs';

export default class Shovel extends AbstractTool {
    get name() {
        return TOOLS_SHOVEL;
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        if (tile.terrain & TERRAIN_CLEARABLE) {
            const tileRes = layer.getRandomTerrain(tile.random);
            layer.drawTile({ ...tile, tileSize: 1 }, tileRes);
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
}
