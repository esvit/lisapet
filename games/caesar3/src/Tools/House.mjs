import AbstractTool from './AbstractTool.mjs';
import { TERRAIN_BUILDING, TERRAIN_NONE, TOOLS_HOUSE } from '../constants.mjs';

export default class House extends AbstractTool {
    get name() {
        return TOOLS_HOUSE;
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        if (tile.terrain === TERRAIN_NONE) {
            layer.drawTileSprite({
                ...tile,
                tileSize: 1
            }, 'housng1a_00045');
            return true;
        }
    }

    changeCell(map, x, y, { terrain }) {
        if (terrain === TERRAIN_NONE) {
            map.set(x, y, {
                tileId: 2823,
                terrain: TERRAIN_BUILDING
            });
        }
    }
}
