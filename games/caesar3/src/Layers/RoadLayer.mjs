import AbstractLayer from './AbstractLayer.mjs';
import { pad } from '../helpers/math.mjs';
import {DIRECTION_NONE, DIRECTION_WEST, DIRECTION_EAST, DIRECTION_NORTH, DIRECTION_SOUTH, TERRAIN_ROAD} from '../constants.mjs';

const RED_ARROWS = {
    [DIRECTION_NORTH]: 'land3a_00085',
    [DIRECTION_WEST]: 'land3a_00086',
    [DIRECTION_SOUTH]: 'land3a_00087',
    [DIRECTION_EAST]: 'land3a_00088',
};

const BLUE_ARROWS = {
    [DIRECTION_NORTH]: 'land3a_00089',
    [DIRECTION_WEST]: 'land3a_00090',
    [DIRECTION_SOUTH]: 'land3a_00091',
    [DIRECTION_EAST]: 'land3a_00092',
};

export default
class RoadLayer extends AbstractLayer{
    #road = {};

    draw(tile, debug = false) {
        const { mapX, mapY } = tile;
        if (this.#road[`${mapX}-${mapY}`]) {
            this.drawTile(tile, `land1a_${pad(2, 5)}`);

            this.drawTile(tile, this.#road[`${mapX}-${mapY}`]);
        }
    }

    rebuildTiles() {
        const tiles = this.map.getTiles(TERRAIN_ROAD);
        for (const { mapX, mapY, drawX, drawY, drawW, drawH, tileSize } of tiles) {
            const direction = this.getRoadDirection(mapX, mapY);

            const res = 'land2a';
            const tileId = this.getTileByDirection(direction);

            this.#road[`${mapX}-${mapY}`] = {
                drawX, drawY, drawW, drawH, tileSize,
                tileId: `${res}_${pad(tileId, 5)}`
            };
        }
    }

    getRoadDirection(x, y) {
        const neighbors = this.map.getNeighbors(x, y);
        let direction = DIRECTION_NONE;
        for (const nTile of neighbors) {
            if (nTile.terrain & TERRAIN_ROAD) {
                direction |= nTile.direction;
            }
        }
        return direction;
    }

    drawLayer() {
        for (const key in this.#road) {
            const { drawX, drawY, drawW, drawH, tileId, tileSize } = this.#road[key];

            this.drawTile({ drawX, drawY, drawW, drawH, tileSize }, tileId);
        }

        const [x1, y1, x2, y2] = this.map.data.peopleEntryPoint;
        { // entry
            const [drawX, drawY, drawW, drawH] = this.map.toCordinates(x1, y1);
            const direction = this.getRoadDirection(x1, y1);
            this.drawTile({ drawX, drawY, drawW, drawH }, RED_ARROWS[direction]);
        }
        { // exit
            const [drawX, drawY, drawW, drawH] = this.map.toCordinates(x2, y2);
            const direction = this.getRoadDirection(x2, y2);

            this.drawTile({ drawX, drawY, drawW, drawH }, BLUE_ARROWS[direction]);
        }
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
