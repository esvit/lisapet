import AbstractTool from './AbstractTool.mjs';
import { TERRAIN_NOT_CLEAR, TOOLS_BUILDING } from '../constants.mjs';
import EngineerPost from '../Buildings/EngineerPost.mjs';
import { getTileByBuildingId } from '../helpers/buildingTileId.mjs';

export default class BuildingTool extends AbstractTool {
    constructor(buildingId, price) {
        super();
        
        this.buildingId = buildingId;
        this.price = price;
    }
    
    get isDraggable() {
        return false;
    }
    
    get name() {
        return TOOLS_BUILDING;
    }

    isValid(terrain) {
        return !(terrain & TERRAIN_NOT_CLEAR);
    }

    drawHoverCell(layer, mapX, mapY, tile) {
        const isValid = !(tile.terrain & TERRAIN_NOT_CLEAR);
        layer.drawTileSprite(tile, getTileByBuildingId(this.buildingId));
        layer.drawColorTile(mapX, mapY, isValid ? '#3cb04366' : '#ff000066');
    }

    changeCell(map, x, y, { terrain }) {
        if (this.isValid(terrain)) {
            map.addBuilding(new EngineerPost(map, x, y));
            // map.set(x, y, {
            //     tileId: 2823,
            //     terrain: TERRAIN_BUILDING
            // });
        }
    }

    mouseMove(map, [mapX, mapY]) {
        const cell = map.get(mapX, mapY);
    }

    apply(map, [start]) {
        const [mapX, mapY] = start;
        const tile = map.get(mapX, mapY);
        const isValid = !(tile.terrain & TERRAIN_NOT_CLEAR);
        if (isValid) {
            map.addBuilding(new EngineerPost(map, mapX, mapY));
        }
        return isValid;
    }
}
