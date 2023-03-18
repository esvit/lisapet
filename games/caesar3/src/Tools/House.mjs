import AbstractTool from './AbstractTool.mjs';
import {
    BUILDING_HOUSE_VACANT_LOT,
    INVALID_CELL_COLOR, TERRAIN_CLEARABLE,
    TERRAIN_NOT_CLEAR,
    TOOLS_HOUSE,
    VALID_CELL_COLOR
} from '../constants.mjs';
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
        layer.drawColorTile(mapX, mapY, isValid ? VALID_CELL_COLOR : INVALID_CELL_COLOR);
    }

    changeCell(map, x, y, { terrain }) {
        if (this.isValid(terrain)) {
            map.addBuilding(new House(map, x, y));
        }
    }

    prepareAction(coords) {
        if (!coords) {
            return;
        }
        const [start, end] = coords;
        const area = new Path(start, end);
        const coordinates = area.getCoordinates();
        const tiles = [];
        for (const [x, y] of coordinates) {
            const tile = this.map.get(x, y);
            if (tile.terrain & TERRAIN_CLEARABLE) {
                tiles.push(tile);
            }
        }
        this.tiles = tiles;
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
