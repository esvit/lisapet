import AbstractLayer from './AbstractLayer.mjs';
import {
    TERRAIN_AQUEDUCT,
    TERRAIN_MEADOW,
    TERRAIN_ROAD,
    TERRAIN_ROCK,
    TERRAIN_SHRUB,
    TERRAIN_TREE,
    TERRAIN_WATER,
    TERRAIN_RUBBLE
} from '../constants.mjs';

export default
class ColorLayer extends AbstractLayer {
    drawTile({ mapX, mapY, terrain }) {
        this.drawColorTile(mapX, mapY, this.getTerrainColor(terrain));
    }

    getTerrainColor(terrain) {
        if (terrain === 0) return '#00000000';
        if (terrain & TERRAIN_TREE) return '#3cb04366';
        if (terrain & TERRAIN_ROCK) return '#cccccc66';
        if (terrain & TERRAIN_WATER) return '#0000FF66';
        // if (terrain & TERRAIN_BUILDING) return 'blue';
        if (terrain & TERRAIN_SHRUB) return '#3cb04366';
        // if (terrain & TERRAIN_GARDEN) return 'blue';
        if (terrain & TERRAIN_ROAD) return '#69696966';
        // if (terrain & TERRAIN_RESERVOIR_RANGE) return 'blue';
        if (terrain & TERRAIN_AQUEDUCT) return '#0000FF66';
        // if (terrain & TERRAIN_ELEVATION) return 'blue';
        // if (terrain & TERRAIN_ACCESS_RAMP) return 'blue';
        if (terrain & TERRAIN_MEADOW) return '#FFCC0066';
        if (terrain & TERRAIN_RUBBLE) return '#D000FF66';
        // if (terrain & TERRAIN_FOUNTAIN_RANGE) return 'blue';
        // if (terrain & TERRAIN_WALL) return 'blue';
        // if (terrain & TERRAIN_GATEHOUSE) return 'blue';
        // if (terrain & TERRAIN_GATEHOUSE) return 'blue';
        return '#FF000066';
    }
}
