import {
    MAP_SIZE_AND_BORDER, MAX_MAP_SIZE, LAYER_GRID, LAYER_TERRAIN, LAYER_ROAD,
    DIRECTION_WEST,
    DIRECTION_NORTH,
    DIRECTION_SOUTH,
    DIRECTION_EAST, MAP_MOVE_BORDER
} from './constants.mjs';
import GridLayer from './Layers/GridLayer.mjs';
import { createOffscreenCanvas } from './helpers/offscreenCanvas.mjs';
import DrawingContext from '../../../src/DrawingContext.mjs';
import TerrainLayer from './Layers/TerrainLayer.mjs';
import RoadLayer from './Layers/RoadLayer.mjs';

const TILE_WIDTH = 58;
const TILE_HEIGHT = 30;

export default
class Map {
    #di = null;

    #mapData = null;

    #tileWidth = null;

    #tileHeight = null;

    #halfTileWidth = null;

    #halfTileHeight = null;

    #canvas = null;

    #context = null;

    #zoom = null;

    #layers = {
        [LAYER_TERRAIN]: null,
        [LAYER_ROAD]: null,
        [LAYER_GRID]: null,
    };

    #enabledLayers = LAYER_TERRAIN;

    #mapOffset = [0, 0];

    constructor(di, mapData, tileWidth = TILE_WIDTH, tileHeight = TILE_HEIGHT) {
        this.#di = di;
        this.#mapData = mapData;
        this.#tileWidth = tileWidth;
        this.#tileHeight = tileHeight;
        this.#halfTileWidth = tileWidth / 2;
        this.#halfTileHeight = tileHeight / 2;
        this.#zoom = 1;
        this.initMap();
    }

    initMap() {
        this.mapBorder = (MAX_MAP_SIZE - this.#mapData.mapWidth) / 2 + 1;

        this.#canvas = createOffscreenCanvas(
            MAP_SIZE_AND_BORDER * this.#tileWidth,
            MAP_SIZE_AND_BORDER * this.#tileHeight
        );
        this.#context = new DrawingContext({ canvas: this.#canvas });

        const scope = this.#di.scope();
        scope.set('canvas', this.#canvas);
        scope.set('DrawingContext', new DrawingContext({ canvas: this.#canvas }));

        this.#layers[LAYER_TERRAIN] = new TerrainLayer(this, scope);
        this.#layers[LAYER_ROAD] = new RoadLayer(this, scope);
        this.#layers[LAYER_GRID] = new GridLayer(this, scope);

        this.#layers[LAYER_ROAD].rebuildTiles();

        this.#mapOffset = [-(this.drawWidth - this.windowWidth) / 2, -(this.drawHeight - this.windowHeight) / 2];
    }

    get tileWidth() {
        return this.#tileWidth;
    }

    get tileHeight() {
        return this.#tileHeight;
    }

    get mapOffset() {
        return this.#mapOffset;
    }

    get size() {
        return MAX_MAP_SIZE;
    }

    get zoom() {
        return this.#zoom;
    }

    get data() {
        return this.#mapData;
    }

    set zoom(val) {
        const centerX = this.windowWidth / 2;
        const centerY = this.windowHeight / 2;
        let [x, y] = this.mapOffset;
        x -= centerX;
        y -= centerY;
        x = x / this.#zoom * val;
        y = y / this.#zoom * val;
        x += centerX;
        y += centerY;
        this.#mapOffset = [x, y]; // збереження центру при зміні масштабу

        this.#zoom = val;
        this.move(0, 0);
    }

    get enabledLayers() {
        return this.#enabledLayers;
    }

    set enabledLayers(val) {
        this.#enabledLayers = val;
    }

    get drawWidth() {
        return this.#canvas.width * this.zoom;
    }

    get drawHeight() {
        return this.#canvas.height * this.zoom;
    }

    get windowWidth() {
        return window.innerWidth;
    }

    get windowHeight() {
        return window.innerHeight;
    }

    move(x, y) {
        const [offsetX, offsetY] = this.#mapOffset;
        let newX = offsetX + x;
        const mapBorderWidth = (this.mapBorder * this.#tileWidth) * this.#zoom;
        const mapBorderHeight = (this.mapBorder * this.#tileHeight) * this.#zoom;
        const maxVisibleWidth = this.drawWidth - this.windowWidth - mapBorderWidth;
        const maxVisibleHeight = this.drawHeight - this.windowHeight - mapBorderHeight;
        if (newX < -maxVisibleWidth) {
            newX = -maxVisibleWidth;
        }
        if (newX > -mapBorderWidth) {
            newX = -mapBorderWidth;
        }

        let newY = offsetY + y;
        if (newY < -maxVisibleHeight) {
            newY = -maxVisibleHeight;
        }
        if (newY > -mapBorderHeight) {
            newY = -mapBorderHeight;
        }
        this.#mapOffset = [newX, newY];
        return this.#mapOffset;
    }

    toCordinates(mapX, mapY, forTile = false) {
        if ((mapX < 0 || mapX > MAX_MAP_SIZE) || (mapY < 0 || mapY > MAX_MAP_SIZE)) {
            throw new Error(`Out of bounds (${mapX}, ${mapY})`);
        }
        return [
            (mapX - mapY + MAX_MAP_SIZE) * this.#halfTileWidth + this.tileWidth - (forTile ? this.#halfTileWidth : 0),
            (mapX + mapY) * this.#halfTileHeight + this.tileHeight - (forTile ? this.#tileHeight : 0),
            this.#tileWidth,
            this.#tileHeight
        ];
    }

    fromCordinates(x, y) {
        const originX = (x - this.#mapOffset[0] - this.#tileWidth) / this.#zoom;
        const originY = (y - this.#mapOffset[1] - this.#tileHeight) / this.#zoom;
        const mapX = (originX / this.#halfTileWidth + originY / this.#halfTileHeight - MAX_MAP_SIZE) / 2;
        const mapY = MAX_MAP_SIZE - (originX / this.#halfTileWidth - mapX);

        if (x < 0 || y < 0 || mapX > MAX_MAP_SIZE || mapY > MAX_MAP_SIZE || mapX < 0 || mapY < 0) {
            return null;
        }
        return [
            Math.floor(mapX),
            Math.floor(mapY)
        ];
    }

    redraw() {
        this.#context.clear('#000');
        for (const layerKey in this.#layers) {
            const layer = this.#layers[layerKey];
            if (!(this.#enabledLayers & Number(layerKey))) {
                continue;
            }
            layer.drawLayer();
        }
        // if (this.#layers & LAYER_TERRAIN) {
        //     this.terrainLayer.drawLayer();
        // }
        // if (this.#layers & LAYER_ROAD) {
        //     this.roadLayer.drawLayer();
        // }
        // if (this.#layers & LAYER_GRID) {
        //     this.gridLayer.drawLayer();
        // }
        return this.#canvas.getImage();
    }

    * getTiles(flags = null) {
        for (let mapY = 0; mapY <= MAX_MAP_SIZE; mapY++) {
            for (let mapX = 0; mapX <= MAX_MAP_SIZE; mapX++) {
                const [drawX, drawY, drawW, drawH] = this.toCordinates(mapX, mapY, true);
                const { offset, tile, terrain, edge, elevation } = this.get(mapX, mapY)
                if (tile === 0 && terrain === 0) {
                    continue;
                }
                // if (terrain === TERRAIN_NONE) {
                //     continue;
                // }
                if (flags !== null && !(terrain & flags)) {
                    continue;
                }
                yield {
                    mapX, mapY,
                    drawX, drawY, drawW, drawH,
                    offset,
                    tile, terrain, edge, elevation
                };
            }
        }
    }

    getNeighbors(mapX, mapY, includeAll = false) {
        const res = [
            { direction: DIRECTION_WEST, ...this.get(mapX - 1, mapY) },
            { direction: DIRECTION_EAST, ...this.get(mapX + 1, mapY) },
            { direction: DIRECTION_NORTH, ...this.get(mapX, mapY - 1) },
            { direction: DIRECTION_SOUTH, ...this.get(mapX, mapY + 1) },
        ];
        if (includeAll) {
            res.push(
                { direction: DIRECTION_NORTH + DIRECTION_WEST, ...this.get(mapX - 1, mapY - 1) },
                { direction: DIRECTION_NORTH + DIRECTION_EAST, ...this.get(mapX + 1, mapY - 1) },
                { direction: DIRECTION_SOUTH + DIRECTION_WEST, ...this.get(mapX - 1, mapY + 1) },
                { direction: DIRECTION_SOUTH + DIRECTION_EAST, ...this.get(mapX + 1, mapY + 1) },
            );
        }
        return res;
    }

    get(mapX, mapY) {
        if (mapX < 0 || mapY < 0 || mapX > MAX_MAP_SIZE || mapY > MAX_MAP_SIZE) {
            return null;
        }
        const offset = mapY * (MAX_MAP_SIZE + 2) + mapX;
        return {
            mapX, mapY,
            offset,
            tile: this.#mapData.tileId[offset],
            terrain: this.#mapData.terrainInfo[offset],
            edge: this.#mapData.edgeData[offset],
            elevation: this.#mapData.heightInfo[offset]
        };
    }

    mouseMove(x, y) {
        this.#layers[LAYER_GRID].mouseMove(x, y);
    }
}
