import {
    MAP_SIZE_AND_BORDER, MAX_MAP_SIZE, LAYER_GRID, LAYER_TERRAIN, LAYER_ROAD,
    DIRECTION_WEST,
    DIRECTION_NORTH,
    DIRECTION_SOUTH,
    DIRECTION_EAST, LAYER_COLOR, LAYER_NATURE, TERRAIN_TYPES, EDGE_OCCUPIED
} from './constants.mjs';
import GridLayer from './Layers/GridLayer.mjs';
import { createOffscreenCanvas } from './helpers/offscreenCanvas.mjs';
import DrawingContext from '../../../src/DrawingContext.mjs';
import TerrainLayer from './Layers/TerrainLayer.mjs';
import RoadLayer from './Layers/RoadLayer.mjs';
import NatureLayer from './Layers/NatureLayer.mjs';
import ColorLayer from "./Layers/ColorLayer.mjs";

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
        [LAYER_NATURE]: null,
        [LAYER_COLOR]: null,
        [LAYER_GRID]: null,
    };

    #enabledLayers = LAYER_TERRAIN | LAYER_ROAD;

    #mapOffset = [0, 0];

    #visibleAreaSize = [1000, 1000]; // розмір видимої області карти

    constructor(di, mapData, tileWidth = TILE_WIDTH, tileHeight = TILE_HEIGHT) {
        this.#di = di;
        this.#mapData = mapData;
        this.#tileWidth = tileWidth;
        this.#tileHeight = tileHeight;
        this.#halfTileWidth = tileWidth / 2;
        this.#halfTileHeight = tileHeight / 2;
        this.#zoom = 1;
    }

    initDebugMap() {
        this.#mapData = {
            tileId: new Array(162 * 162),
            terrainInfo: new Array(162 * 162),
            edgeData: new Array(162 * 162),
            heightInfo: new Array(162 * 162),
            mapWidth: 80,
            mapHeight: 80,
            peopleEntryPoint: [1, 1, 79,79]
        };
        this.initMap();
        this.set(0, 2, { tileId: 851, edgeData: 72 });
        this.set(1, 2, { tileId: 854, edgeData: 73 });
        this.set(0, 6, { tileId: 481, edgeData: 80 });
        // this.set(2, 0, { tileId: 248, edgeData: 0x40 });
        // this.set(5, 5, { tileId: 865, edgeData: 0x40 });
    }

    initMap() {
        this.mapBorder = (MAX_MAP_SIZE - this.#mapData.mapWidth) / 2;

        this.#canvas = createOffscreenCanvas(
            MAP_SIZE_AND_BORDER * this.#tileWidth,
            MAP_SIZE_AND_BORDER * this.#tileHeight
        );
        console.info(MAP_SIZE_AND_BORDER * this.#tileWidth, MAP_SIZE_AND_BORDER * this.#tileHeight)
        this.#context = new DrawingContext({ canvas: this.#canvas });

        const scope = this.#di.scope();
        scope.set('canvas', this.#canvas);
        scope.set('DrawingContext', new DrawingContext({ canvas: this.#canvas }));

        this.#layers[LAYER_TERRAIN] = new TerrainLayer(this, scope);
        this.#layers[LAYER_ROAD] = new RoadLayer(this, scope);
        this.#layers[LAYER_NATURE] = new NatureLayer(this, scope);
        this.#layers[LAYER_COLOR] = new ColorLayer(this, scope);
        this.#layers[LAYER_GRID] = new GridLayer(this, scope);

        this.#layers[LAYER_ROAD].rebuildTiles();

        this.#mapOffset = [-(this.drawWidth - this.windowWidth) / 2, -(this.drawHeight - this.windowHeight) / 2];
    }

    get visibleAreaSize() {
        return this.#visibleAreaSize;
    }

    set visibleAreaSize(val) {
        this.#visibleAreaSize = val;
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
        return this.#mapData.mapWidth;
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
        const [visibleW, visibleH] = this.#visibleAreaSize;
        const mapBorderWidth = (this.mapBorder * this.#tileWidth) * this.#zoom;
        const mapBorderHeight = (this.mapBorder * this.#tileHeight) * this.#zoom;
        const maxVisibleWidth = this.drawWidth - visibleW - mapBorderWidth;
        const maxVisibleHeight = this.drawHeight - visibleH - mapBorderHeight;
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
        mapX += this.mapBorder
        mapY += this.mapBorder
        return [
            (mapX - mapY + MAX_MAP_SIZE) * this.#halfTileWidth + this.tileWidth,// - (forTile ? this.#halfTileWidth : 0),
            (mapX + mapY) * this.#halfTileHeight + this.tileHeight,// + (forTile ? this.#tileHeight / 2 : 0),
            this.#tileWidth,
            this.#tileHeight
        ];
    }

    fromCordinates(x, y) {
        const originX = (x - this.#mapOffset[0] - this.#tileWidth) / this.#zoom;
        const originY = (y - this.#mapOffset[1] - this.#tileHeight) / this.#zoom;
        let mapX = (originX / this.#halfTileWidth + originY / this.#halfTileHeight - MAX_MAP_SIZE) / 2;
        let mapY = MAX_MAP_SIZE - (originX / this.#halfTileWidth - mapX);
        mapX = Math.floor(mapX) - this.mapBorder;
        mapY = Math.floor(mapY) - this.mapBorder;

        if (x < 0 || y < 0 || mapX >= this.size || mapY >= this.size || mapX < 0 || mapY < 0) {
            return null;
        }
        return [mapX, mapY];
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
        for (let mapY = 0; mapY < this.size; mapY++) {
            for (let mapX = 0; mapX < this.size; mapX++) {
                const [drawX, drawY, drawW, drawH] = this.toCordinates(mapX, mapY, true);
                const { offset, tile, terrain, edge, elevation, tileSize } = this.get(mapX, mapY)
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
                    tile, terrain, edge, elevation, tileSize
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
        if (mapX < 0 || mapY < 0 || mapX > this.size + 1 || mapY > this.size + 1) {
            return null;
        }
        const x = mapX + this.mapBorder + 1; // відступити 1 комірку границі
        const y = mapY + this.mapBorder + 1;
        const offset = y * MAP_SIZE_AND_BORDER + x;
        const edge = this.#mapData.edgeData[offset];
        let tileSize = 1;
        if (edge & EDGE_OCCUPIED) {
            tileSize += (edge - EDGE_OCCUPIED) / 8;
        }
        return {
            mapX, mapY,
            offset,
            tileSize,
            tile: this.#mapData.tileId[offset],
            terrain: this.#mapData.terrainInfo[offset],
            edge,
            elevation: this.#mapData.heightInfo[offset]
        };
    }


    set(mapX, mapY, { tileId, terrainInfo, edgeData, heightInfo }) {
        if (mapX < 0 || mapY < 0 || mapX > this.size + 1 || mapY > this.size + 1) {
            return null;
        }
        const x = mapX + this.mapBorder + 1; // відступити 1 комірку границі
        const y = mapY + this.mapBorder + 1;
        const offset = y * MAP_SIZE_AND_BORDER + x;

        if (typeof tileId !== 'undefined') {
            this.#mapData.tileId[offset] = tileId;
        }
        if (typeof terrainInfo !== 'undefined') {
            this.#mapData.terrainInfo[offset] = terrainInfo;
        }
        if (typeof edgeData !== 'undefined') {
            this.#mapData.edgeData[offset] = edgeData;
        }
        if (typeof heightInfo !== 'undefined') {
            this.#mapData.heightInfo[offset] = heightInfo;
        }
    }

    getTerrainInfo(mapX, mapY) {
        const cell = this.get(mapX, mapY);
        const terrainInfo = [];
        for (const type of TERRAIN_TYPES) {
            terrainInfo.push(`${type.title}: ${cell.terrain & type.id ? '✅' : '❌'}`);
        }
        return {
            ...cell,
            terrainInfo: terrainInfo.join('\n')
        };
    }

    mouseMove(x, y) {
        if (this.#layers[LAYER_GRID]) {
            this.#layers[LAYER_GRID].mouseMove(x, y);
        }
    }
}
