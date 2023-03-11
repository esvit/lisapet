import AbstractTool from './AbstractTool.mjs';
import {
    BUILDING_HOUSE_VACANT_LOT,
    DIRECTION_EAST,
    DIRECTION_NONE,
    DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_WEST, TERRAIN_NOT_CLEAR, TERRAIN_PATH_ROAD,
    TERRAIN_ROAD,
    TOOLS_ROAD
} from '../constants.mjs';
import {pad} from "../helpers/math.mjs";
import {getIdByTile} from "../helpers/tileId.mjs";
import Path from "../Path.mjs";
import {getTileByBuildingId} from "../helpers/buildingTileId.mjs";

export default class Road extends AbstractTool {
    #buildedPath = null;

    get name() {
        return TOOLS_ROAD;
    }

    prepareArea(map, area) {
        this.#buildedPath = area.buildPath(map, { occupied: true, mapOccupied: true }, TERRAIN_PATH_ROAD);
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
        map.rebuildRoad();
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        if (!this.#buildedPath) {
            return;
        }
        const cell = this.#buildedPath.find(({ x, y }) => x === mapX && y === mapY);
        if (cell) {
            const tileRes = layer.getRandomTerrain(tile.random);
            layer.drawTileSprite({ ...tile, tileSize: 1 }, tileRes);

            const res = 'land2a';
            const tileId = this.getTileByDirection(cell.occupied);
            layer.drawTileSprite({
                ...tile,
                tileSize: 1
            }, `${res}_${pad(tileId, 5)}`);
            return true;
        }
    }

    changeCell(map, mapX, mapY) {
        if (!this.#buildedPath) {
            return;
        }
        const cell = this.#buildedPath.find(({ x, y }) => x === mapX && y === mapY);
        if (cell) {
            const res = 'land2a';
            const tileId = this.getTileByDirection(cell.occupied);
            map.set(mapX, mapY, {
                tileId: getIdByTile([res, tileId]),
                terrain: TERRAIN_ROAD
            });
        }
    }

    drawHoverCell(layer, mapX, mapY, tile) {
        const isValid = !(tile.terrain & TERRAIN_NOT_CLEAR);
        const res = 'land2a';
        const tileId = this.getTileByDirection(DIRECTION_NORTH & DIRECTION_EAST & DIRECTION_SOUTH & DIRECTION_WEST);
        layer.drawTileSprite(tile, [res, tileId]);
        layer.drawColorTile(mapX, mapY, isValid ? '#3cb04366' : '#ff000066');
    }
    
    getTileByDirection(direction) {
        switch (direction)
        {
            case DIRECTION_NONE: return 101; // no road!
            case DIRECTION_NORTH: // North
                return 101;
          // _changeIndexIfAqueduct( areaInfo, index, 120 );
            case DIRECTION_EAST: // East
                return 102;
          // _changeIndexIfAqueduct( areaInfo, index, 119 );
            case DIRECTION_SOUTH: // South
                return 103;
          // _changeIndexIfAqueduct( areaInfo, index, 120 );
            case DIRECTION_WEST: // West
                return 104;
          // _changeIndexIfAqueduct( areaInfo, index, 119 );
            case DIRECTION_NORTH + DIRECTION_EAST: return 97; // North+East
            case DIRECTION_NORTH + DIRECTION_WEST: return 100; // North+West
            case DIRECTION_SOUTH + DIRECTION_EAST: return 98; // East+South
            case DIRECTION_SOUTH + DIRECTION_WEST: return 99;  // South+West
            case DIRECTION_EAST + DIRECTION_WEST: return 94; // 94/96 // East+West

            case DIRECTION_NORTH + DIRECTION_SOUTH: return 93; // 93/95 // North+South

          // index = 94+2*((p.i() + p.j())%2);
          // _changeIndexIfAqueduct( areaInfo, index, 119);
            case DIRECTION_NORTH + DIRECTION_EAST + DIRECTION_WEST: return 109; // North+East+West
            case DIRECTION_NORTH + DIRECTION_EAST + DIRECTION_SOUTH: return 106; // North+East+South
            case DIRECTION_NORTH + DIRECTION_SOUTH + DIRECTION_WEST: return 108; // North+South+West
            case DIRECTION_EAST + DIRECTION_SOUTH + DIRECTION_WEST: return 107; // East+South+West
            case DIRECTION_NORTH + DIRECTION_EAST + DIRECTION_SOUTH + DIRECTION_WEST: return 110; // North+East+South+West
        }
    }
}
