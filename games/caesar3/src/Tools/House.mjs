import AbstractTool from './AbstractTool.mjs';
import { TERRAIN_NONE, TOOLS_HOUSE } from '../constants.mjs';
import House from '../Buildings/House.mjs';

export default class HouseTool extends AbstractTool {
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
            map.addBuilding(new House(map, x, y));
            // map.set(x, y, {
            //     tileId: 2823,
            //     terrain: TERRAIN_BUILDING
            // });
        }
    }
}
