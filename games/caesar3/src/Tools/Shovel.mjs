import AbstractTool from './AbstractTool.mjs';
import {
    EDGE_OCCUPIED,
    LAYER_TERRAIN,
    TERRAIN_CLEARABLE,
    TERRAIN_NONE,
    TILE_SIZE_1X,
    TOOLS_SHOVEL,
    VALID_CELL_COLOR,
    INVALID_CELL_COLOR,
    ACTION_CLEAR
} from '../constants.mjs';
import Path from '../Path.mjs';

export default class Shovel extends AbstractTool {
    constructor(map) {
        super(map, ACTION_CLEAR);
    }
    
    get name() {
        return TOOLS_SHOVEL;
    }

    get price() {
        return this.tiles.length * 20;
    }

    isValid(terrain) {
        return terrain & TERRAIN_CLEARABLE;
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        const isValid = this.isValid(tile.terrain);
        if (isValid) {
            const tileRes = layer.getRandomTerrain(tile.random);
            layer.drawTileSprite({ ...tile, tileSize: 1 }, tileRes);
            layer.drawColorTile(mapX, mapY, VALID_CELL_COLOR);
            return true;
        } else {
            layer.drawColorTile(mapX, mapY, INVALID_CELL_COLOR);
        }
    }

    drawHoverCell(layer, mapX, mapY, tile) {
        const isValid = this.isValid(tile.terrain);
        layer.drawColorTile(mapX, mapY, isValid ? VALID_CELL_COLOR : INVALID_CELL_COLOR, this.price);
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

    apply() {
        this.map.doAction(this);
        this.tiles = [];
    }
}
