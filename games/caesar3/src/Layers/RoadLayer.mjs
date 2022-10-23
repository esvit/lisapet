import AbstractLayer from './AbstractLayer.mjs';
import { pad } from '../helpers/math.mjs';
import {DIRECTION_NONE, DIRECTION_WEST, DIRECTION_EAST, DIRECTION_NORTH, DIRECTION_SOUTH, TERRAIN_ROAD} from '../constants.mjs';

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
        for (const { mapX, mapY, drawX, drawY, drawW, drawH } of tiles) {
            let direction = DIRECTION_NONE;

            const neighbors = this.map.getNeighbors(mapX, mapY);
            for (const nTile of neighbors) {
                if (nTile.terrain & TERRAIN_ROAD) {
                    direction |= nTile.direction;
                }
            }

            const res = 'land2a';
            const tileId = this.getTileByDirection(direction);

            this.#road[`${mapX}-${mapY}`] = {
                drawX, drawY, drawW, drawH,
                tileId: `${res}_${pad(tileId, 5)}`
            };
        }
    }

    drawLayer() {
        if (this.#road) {
            for (const key in this.#road) {
                const {drawX, drawY, drawW, drawH, tileId} = this.#road[key];

                this.drawTile({drawX, drawY, drawW, drawH}, tileId);
            }
        }

        const [x1, y1, x2, y2] = this.map.data.peopleEntryPoint;
        { // entry
            const [drawX, drawY, drawW, drawH] = this.map.toCordinates(x1 + this.map.mapBorder, y1 + this.map.mapBorder);

            this.drawTile({ drawX, drawY, drawW, drawH }, 'land3a_00087');
        }
        { // exit
            const [drawX, drawY, drawW, drawH] = this.map.toCordinates(x2 + this.map.mapBorder, y2 + this.map.mapBorder);

            this.drawTile({ drawX, drawY, drawW, drawH }, 'land3a_00085');
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
