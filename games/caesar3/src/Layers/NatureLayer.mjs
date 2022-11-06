import AbstractLayer from './AbstractLayer.mjs';
import { pad } from '../helpers/math.mjs';
import {
    EDGE_OCCUPIED,
    TERRAIN_GARDEN,
    TERRAIN_MEADOW,
    TERRAIN_ROAD,
    TERRAIN_ROCK,
    TERRAIN_SHRUB,
    TERRAIN_TREE,
} from '../constants.mjs';

export default
class NatureLayer extends AbstractLayer {
    drawLayer() {
        const tiles = this.map.getTiles();
        for (const tile of tiles) {
            const { tile: imgId, terrain, edge } = tile;
            if (!(edge & EDGE_OCCUPIED)) {
                continue;
            }
            const [res, tileId] = this.getTile(tile);

            if (terrain & TERRAIN_TREE || terrain & TERRAIN_GARDEN || terrain & TERRAIN_SHRUB || terrain & TERRAIN_ROCK) {
                this.drawTile(tile, `${res}_${pad(tileId, 5)}`);
            }
        }
    }

    getRandomTerrain() {
        return ['land1a', 2];
    }

    getTile(tileObj) {
        const { tile, terrain } = tileObj;
        // if (terrain & TERRAIN_SHRUB || terrain & TERRAIN_ROCK) {
        //     this.drawTile(tileObj, `land1a_${pad(2, 5)}`);
        // }

        // commerce - 00001 - 00167 - 167
        // entertainment - 00001 - 00116 - 116
        // housng1a - 00001 - 00050 - 50
        // land1a - 00001 - 00303 - 303
        // land2a - 00001 - 00231 - 231
        // land3a - 00043 - 00092 - 50
        // plateau - 00001 - 00044 - 44
        // plaza - 03139 - 03144 - 6
        // security - 00001 - 00061 - 61
        // transport - 00001 - 00093 - 93
        // utilitya - 00001 - 00057 - 57
        // well - 00001 - 00004 - 4


        /// 00001 -
        /// 00244 - land1a
        /// 00779 - land2a
        /// 00871 - land3a

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
            return ['land1a', 1];
        }
    }
}
