import AbstractTool from './AbstractTool.mjs';
import { BUILDING_HOUSE_VACANT_LOT, TERRAIN_NOT_CLEAR, TOOLS_HOUSE } from '../constants.mjs';
import House from '../Buildings/House.mjs';
import Path from '../Path.mjs';
import { getTileByBuildingId } from '../helpers/buildingTileId.mjs';

export default class HouseTool extends AbstractTool {
    get name() {
        return TOOLS_HOUSE;
    }
    
    isValid(terrain) {
        return !(terrain & TERRAIN_NOT_CLEAR);
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        if (this.isValid(tile.terrain)) {
            layer.drawTileSprite({
                ...tile,
                tileSize: 1
            }, getTileByBuildingId(BUILDING_HOUSE_VACANT_LOT));
            return true;
        }
    }

    drawHoverCell(layer, mapX, mapY, tile) {
        const isValid = this.isValid(tile.terrain);
        layer.drawTileSprite(tile, getTileByBuildingId(BUILDING_HOUSE_VACANT_LOT));
        layer.drawColorTile(mapX, mapY, isValid ? '#3cb04366' : '#ff000066');
    }

    changeCell(map, x, y, { terrain }) {
        if (this.isValid(terrain)) {
            map.addBuilding(new House(map, x, y));
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
