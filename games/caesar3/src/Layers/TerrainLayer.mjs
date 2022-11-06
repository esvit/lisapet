import AbstractLayer from './AbstractLayer.mjs';
import { pad } from '../helpers/math.mjs';
import {
    EDGE_OCCUPIED, TERRAIN_CLEARABLE,
    TERRAIN_ROAD
} from '../constants.mjs';
import Area from "../Area.mjs";

const GROUPS = [
    { id: 'plateau', start: 200, count: 44 },
    { id: 'land1a', start: 244, count: 303 },
    { id: 'land2a', start: 547, count: 231 },
    { id: 'land3a', start: 778, count: 50 },
    { id: 'housng1a', start: 2829, count: 50 }
];

// commerce - 00001 - 00167 - 167
// entertainment - 00001 - 00116 - 116
// plaza - 03139 - 03144 - 6
// security - 00001 - 00061 - 61
// transport - 00001 - 00093 - 93
// utilitya - 00001 - 00057 - 57
// well - 00001 - 00004 - 4
export default
class TerrainLayer extends AbstractLayer {
    drawLayer() {
        const selectedZone = this.map.selectedArea ? new Area(...this.map.selectedArea) : null;
        const tiles = this.map.getTiles();
        for (const tile of tiles) {
            const { mapX, mapY, edge, terrain, minimapInfo } = tile;
            const tileSprite = this.getTile(tile);
            if (!tileSprite) {
                continue;
            }
            const [res, tileId] = tileSprite;

            if (selectedZone && selectedZone.inArea(mapX, mapY) && (terrain & TERRAIN_CLEARABLE)) {
                this.drawTile({
                    ...tile,
                    tileSize: 1
                }, minimapInfo ===32 ? 'land1a_00252' : 'land1a_00253');
                continue
            }

            if (edge & EDGE_OCCUPIED) {
                // if (edge - 0x40 === 8) {
                //     this.drawTile(tile, `${res}_${pad(6, 5)}`);
                // } else {
                    this.drawTile(tile, `${res}_${pad(tileId, 5)}`);
                // }
            }
        }
    }

    getRandomTerrain() {
        return ['land1a', 2];
    }

    getTile(tileObj) {
        const { tile, terrain } = tileObj;

        // if (terrain & TERRAIN_ROAD) {
        //     return ['land1a', tile - 545];
        // }
        //
        // for (const group of GROUPS) {
        //     if (tile >= group.start && tile <= group.start + group.count) {
        //         return [group.id, tile - group.start];
        //     }
        // }

        if (terrain & TERRAIN_ROAD) {
            // console.info(imgId)
            // 640
            // 650
            // 648
            return ['land1a', tile - 545];
        // } else if (terrain & TERRAIN_TREE) {
            // return this.getRandomTerrain();
        // } else if (terrain & TERRAIN_MEADOW) {
            // return this.getRandomTerrain();
        // } else if (terrain & TERRAIN_ROCK) {
            // return this.getRandomTerrain();
        } else if( tile >= 668 && tile <= 673 ) { //aqueduct
            return ['plateau', 30];
        } else if( tile >= 372 && tile <= 427 ) {
            // console.info('Coast')
            return ['land1a', pad(tile - 244, 5)];
        } else if( tile >= 863 && tile <= 870 ) {
            return this.getRandomTerrain();
        }

        if (tile < 245) {
            return ['plateau', tile - 200];
        } else if( tile < 548 ) {
            return ['land1a', tile - 244];
        } else if( tile < 779 ) {
            return ['land2a', tile - 547];
        } else if( tile < 871) {
            return ['land3a', tile - 778];
        } else if( tile < 2900) {
            return ['housng1a', tile - 2829];
        } else {
            if (tile === 0xb10 || tile === 0xb0d)
            {
                return ['housng1a', 51];
            }
            // return ['land1a', 1];
        }
    }
}
