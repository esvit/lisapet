import AbstractTool from './AbstractTool.mjs';
import { TERRAIN_CLEARABLE, TERRAIN_NONE, TOOLS_SHOVEL } from '../constants.mjs';

export default class Shovel extends AbstractTool {
    get name() {
        return TOOLS_SHOVEL;
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        if (tile.terrain & TERRAIN_CLEARABLE) {
            layer.drawTile({
                ...tile,
                tileSize: 1
            }, 'land1a_00253');
            return true;
        }
    }

    changeCell(map, x, y, { terrain }) {
        if (terrain & TERRAIN_CLEARABLE) {
            map.set(x, y, {
                tileId: 499,
                terrain: TERRAIN_NONE
            });
        }
    }
}
