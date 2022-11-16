import {
    MAP_SIZE_AND_BORDER,
    MAX_MAP_SIZE,
    LAYER_GRID,
    LAYER_TERRAIN,
    LAYER_ROAD,
    DIRECTION_WEST,
    DIRECTION_NORTH,
    DIRECTION_SOUTH,
    DIRECTION_EAST,
    LAYER_COLOR,
    LAYER_NATURE,
    TERRAIN_TYPES,
    EDGE_OCCUPIED,
    TILE_SIZE_2X,
    TILE_SIZE_3X,
    TERRAIN_CLEARABLE, TERRAIN_NONE, TOOLS_SHOVEL, TOOLS_HOUSE, TERRAIN_BUILDING
} from './constants.mjs';
import GridLayer from './Layers/GridLayer.mjs';
import { createOffscreenCanvas } from './helpers/offscreenCanvas.mjs';
import DrawingContext from '../../../src/DrawingContext.mjs';
import TerrainLayer from './Layers/TerrainLayer.mjs';
import RoadLayer from './Layers/RoadLayer.mjs';
import NatureLayer from './Layers/NatureLayer.mjs';
import ColorLayer from "./Layers/ColorLayer.mjs";
import Area from "./Area.mjs";

const TILE_WIDTH = 58;
const TILE_HEIGHT = 30;

export default
class Map {
    di = null;

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

    #selectedArea = null; // зона виділена мишкою

    #selectedAreaTool = null; // операція, яку треба провести із зоною, що виділена мишкою,
                              // можливі операції:
                              // - TOOLS_SHOVEL - показує як буде зона виглядати після очищення
                              // - TOOLS_ROAD - показує як буде дорога після побудови
                              // - TOOLS_HOUSE - показує як будуть виглядати зайняті клітинки будинками

    constructor(di, mapData, tileWidth = TILE_WIDTH, tileHeight = TILE_HEIGHT) {
        this.di = di;
        this.#mapData = mapData;
        this.#tileWidth = tileWidth;
        this.#tileHeight = tileHeight;
        this.#halfTileWidth = tileWidth / 2;
        this.#halfTileHeight = tileHeight / 2;
        this.#zoom = 1;
    }

    /**
     * Створює тестову карту
     */
    initDebugMap() {
        this.#mapData = {
            tileId: new Array(162 * 162),
            terrainInfo: new Array(162 * 162),
            edgeData: new Array(162 * 162),
            heightInfo: new Array(162 * 162),
            minimapInfo: new Array(162 * 162),
            mapWidth: 80,
            mapHeight: 80,
            peopleEntryPoint: [1, 1, 79,79]
        };
        this.initMap();
        let i = 1;
        for (let y = 0; y < 160; y += 2) {
            for (let x = 0; x < 160; x += 2) {
                this.set(x, y, {tileId: i++, edgeData: 72 });
            }
        }
        // this.set(0, 2, { tileId: 851, edgeData: 72 });
        // this.set(1, 2, { tileId: 854, edgeData: 73 });
        // this.set(0, 6, { tileId: 481, edgeData: 80 });
        // this.set(2, 0, { tileId: 248, edgeData: 0x40 });
        // this.set(5, 5, { tileId: 865, edgeData: 0x40 });
    }

    /**
     * Ініціалізує усе необхідне для карти
     */
    initMap() {
        this.mapBorder = (MAX_MAP_SIZE - this.#mapData.mapWidth) / 2;

        this.#canvas = createOffscreenCanvas(
            MAP_SIZE_AND_BORDER * this.#tileWidth,
            MAP_SIZE_AND_BORDER * this.#tileHeight
        );
        this.#context = new DrawingContext({ canvas: this.#canvas });

        const scope = this.di.scope();
        scope.set('canvas', this.#canvas);
        scope.set('DrawingContext', new DrawingContext({ canvas: this.#canvas }));

        this.#layers[LAYER_TERRAIN] = new TerrainLayer(this, scope);
        this.#layers[LAYER_ROAD] = new RoadLayer(this, scope);
        this.#layers[LAYER_NATURE] = new NatureLayer(this, scope);
        this.#layers[LAYER_COLOR] = new ColorLayer(this, scope);
        this.#layers[LAYER_GRID] = new GridLayer(this, scope);

        this.#layers[LAYER_ROAD].rebuildTiles();

        const [visibleW, visibleH] = this.#visibleAreaSize;
        this.#mapOffset = [-(this.drawWidth - visibleW) / 2, -(this.drawHeight - visibleH) / 2];
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
        const [visibleW, visibleH] = this.#visibleAreaSize;
        const centerX = visibleW / 2;
        const centerY = visibleH / 2;
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

    get selectedArea() {
        return this.#selectedArea;
    }

    set selectedArea(val) {
        this.#selectedArea = val ? [
            this.fromCordinates(...val[0]),
            this.fromCordinates(...val[1])
        ] : null;
    }

    get selectedAreaTool() {
        return this.#selectedAreaTool;
    }

    set selectedAreaTool(val) {
        this.#selectedAreaTool = val;
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

    toCordinates(mapX, mapY) {
        if ((mapX < 0 || mapX > MAX_MAP_SIZE) || (mapY < 0 || mapY > MAX_MAP_SIZE)) {
            throw new Error(`Out of bounds (${mapX}, ${mapY})`);
        }
        mapX += this.mapBorder
        mapY += this.mapBorder
        return [
            (mapX - mapY + MAX_MAP_SIZE) * this.#halfTileWidth + this.tileWidth,
            (mapX + mapY) * this.#halfTileHeight + this.tileHeight,
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

    draw(ctx) {
        // abstract
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
        this.draw(this.#context);
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
                const res = this.get(mapX, mapY);
                const { tile, terrain } = res;
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
                    ...res
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

    /**
     * Повертає зміщення комірки в масиві згідно з кординатами на карті
     *
     * @param mapX координата X
     * @param mapY координата Y
     * @returns {null|number} null - якщо за межами карти, число у випадку комірки в рамках карти
     */
    getOffset(mapX, mapY) {
        if (mapX < 0 || mapY < 0 || mapX > this.size + 1 || mapY > this.size + 1) {
            return null;
        }
        if (this.mapBorder === null) {
            throw new Error('Call initMap first');
        }
        const x = mapX + this.mapBorder + 1; // відступити 1 комірку границі
        const y = mapY + this.mapBorder + 1;
        return y * MAP_SIZE_AND_BORDER + x;
    }

    /**
     * Повертає комбіновану інформацію про клітинку
     *
     * @param mapX
     * @param mapY
     * @returns {{elevation: *, edge: *, offset: number, tileSize: number, tile: *, terrain: *, mapY, mapX}|null}
     */
    get(mapX, mapY) {
        const offset = this.getOffset(mapX, mapY);
        if (offset === null) {
            return null;
        }
        const edge = this.#mapData.edgeData[offset];
        const minimapInfo = this.#mapData.minimapInfo[offset];
        let tileSize = 1;
        if (minimapInfo & TILE_SIZE_2X) {
            tileSize = 2;
        }
        if (minimapInfo & TILE_SIZE_3X) {
            tileSize = 3;
        }
        // if (edge & EDGE_OCCUPIED) {
        //     // Опис розрахунку розміру клітинки https://esvit.notion.site/Edge-grids-0c4e62c6d26b4baaa7aeee8efe73333c
        //     tileSize += (edge - EDGE_OCCUPIED) / 8;
        // }
        return {
            mapX, mapY,
            offset,
            tileSize,
            tile: this.#mapData.tileId[offset],
            terrain: this.#mapData.terrainInfo[offset],
            edge,
            elevation: this.#mapData.heightInfo[offset],
            minimapInfo
        };
    }

    set(mapX, mapY, { tileId, terrain, edgeData, heightInfo, minimapInfo }) {
        const offset = this.getOffset(mapX, mapY);
        if (offset === null) {
            return null;
        }

        if (typeof tileId !== 'undefined') {
            this.#mapData.tileId[offset] = tileId;
        }
        if (typeof terrain !== 'undefined') {
            this.#mapData.terrainInfo[offset] = terrain;
        }
        if (typeof edgeData !== 'undefined') {
            this.#mapData.edgeData[offset] = edgeData;
        }
        if (typeof heightInfo !== 'undefined') {
            this.#mapData.heightInfo[offset] = heightInfo;
        }
        if (typeof minimapInfo !== 'undefined') {
            this.#mapData.minimapInfo[offset] = minimapInfo;
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

    applyTool([start, end], tool) {
        const area = new Area(start, end);
        const coordinates = area.getCoordinates();
        for (const [x, y] of coordinates) {
            const tile = this.get(x, y);
            tool.changeCell(this, x, y, tile);
        }
        this.#layers[LAYER_ROAD].rebuildTiles();
    }
}
