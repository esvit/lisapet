import {
    LAYER_GRID,
    LAYER_TERRAIN,
    LAYER_ROAD,
    DIRECTION_WEST,
    DIRECTION_NORTH,
    DIRECTION_SOUTH,
    DIRECTION_EAST,
    LAYER_COLOR,
    TERRAIN_TYPES,
    TILE_SIZE_2X,
    TILE_SIZE_3X,
    TILE_SIZE_4X,
    TILE_SIZE_5X,
    TILE_SIZE_1X,
    TERRAIN_NONE,
    LAYER_BUILDINGS,
    LAYER_FIGURES, ACTION_CLEAR, EDGE_OCCUPIED
} from './constants.mjs';
import GridLayer from './Layers/GridLayer.mjs';
import { createOffscreenCanvas } from './helpers/offscreenCanvas.mjs';
import DrawingContext from '../../../src/DrawingContext.mjs';
import TerrainLayer from './Layers/TerrainLayer.mjs';
import RoadLayer from './Layers/RoadLayer.mjs';
import ColorLayer from './Layers/ColorLayer.mjs';
import Path from './Path.mjs';
import {random} from "./helpers/math.mjs";
import GameState from "./GameState.mjs";
import BuildingsLayer from './Layers/BuildingsLayer.mjs';
import FiguresLayer from './Layers/FiguresLayer.mjs';
import {getIdByTile} from "./helpers/tileId.mjs";

const TILE_WIDTH = 58;
const TILE_HEIGHT = 30;

export default
class Map {
    #di = null;

    #data = null;

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
        [LAYER_BUILDINGS]: null,
        [LAYER_FIGURES]: null,
        [LAYER_COLOR]: null,
        [LAYER_GRID]: null,
    };

    #enabledLayers = LAYER_TERRAIN | LAYER_BUILDINGS | LAYER_FIGURES;

    #mapOffset = [0, 0];

    #visibleAreaSize = [1000, 1000]; // розмір видимої області карти

    #selectedArea = null; // зона виділена мишкою

    #selectedAreaTool = null; // операція, яку треба провести із зоною, що виділена мишкою,
                              // можливі операції:
                              // - TOOLS_SHOVEL - показує як буде зона виглядати після очищення
                              // - TOOLS_ROAD - показує як буде дорога після побудови
                              // - TOOLS_HOUSE - показує як будуть виглядати зайняті клітинки будинками

    #gameState = null;
    
    #hoverCell = null;
    
    constructor(di, mapData) {
        this.#di = di;
        this.#data = mapData;
        this.#tileWidth = TILE_WIDTH;
        this.#tileHeight = TILE_HEIGHT;
        this.#halfTileWidth = TILE_WIDTH / 2;
        this.#halfTileHeight = TILE_HEIGHT / 2;
        this.#zoom = 1;
        this.initMap();
    }

    get mapSize() {
        return this.#data.size;
    }

    get tiles() {
        return this.#data.map;
    }

    get entryPoint() {
        return this.#data.entryPoint;
    }

    get state() {
        return this.#gameState;
    }
    
    /**
     * Ініціалізує усе необхідне для карти
     */
    initMap() {
        this.#canvas = createOffscreenCanvas(
            this.mapSize[0] * this.#tileWidth,
          this.mapSize[1] * this.#tileHeight
        );
        this.#context = new DrawingContext({ canvas: this.#canvas });

        const scope = this.#di.scope();
        scope.set('canvas', this.#canvas);
        scope.set('DrawingContext', new DrawingContext({ canvas: this.#canvas }));

        this.#layers[LAYER_TERRAIN] = new TerrainLayer(this, scope);
        this.#layers[LAYER_ROAD] = new RoadLayer(this, scope);
        this.#layers[LAYER_BUILDINGS] = new BuildingsLayer(this, scope);
        this.#layers[LAYER_FIGURES] = new FiguresLayer(this, scope);
        this.#layers[LAYER_COLOR] = new ColorLayer(this, scope);
        this.#layers[LAYER_GRID] = new GridLayer(this, scope);

        this.#layers[LAYER_ROAD].rebuildTiles();

        const [visibleW, visibleH] = this.#visibleAreaSize;
        this.#mapOffset = [-(this.drawWidth - visibleW) / 2, -(this.drawHeight - visibleH) / 2];
        
        this.#gameState = new GameState(this.#data);
    }
    
    static createEmpty(w, h) {
        const data = {
            size: [w, h],
            entryPoint: { x: 0, y: Math.round(h / 2) },
            exitPoint: { x: w - 1, y: Math.round(h / 2) },
            initialState: { funds: 10000 },
            map: new Array(w * h).fill(1)
        };
        for (let i = 0; i < data.map.length; i++) {
            const rand = random(363, 336);
            data.map[i] = [rand, TERRAIN_NONE, rand, TILE_SIZE_1X];
        }
        return data;
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
        return this.mapSize[0];
    }

    get zoom() {
        return this.#zoom;
    }

    get layers() {
        return this.#layers;
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
        this.#selectedArea = val || null;
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
        const mapBorderWidth = 0;
        const mapBorderHeight = 0;
        const maxVisibleWidth = this.drawWidth - visibleW;
        const maxVisibleHeight = this.drawHeight - visibleH;
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

    toCordinates(x, y) {
        if ((x < 0 || x > this.mapSize[0]) || (y < 0 || y > this.mapSize[1])) {
            throw new Error(`Out of bounds (${x}, ${y})`);
        }
        const halfTileWidth = this.#tileWidth / 2;
        const halfTileHeight = this.#tileHeight / 2;

        return [
            (x - y + this.mapSize[0]) * halfTileWidth,
            (x + y) * halfTileHeight,
            this.#tileWidth,
            this.#tileHeight
        ];
    }

    fromCordinates(x, y) {
        const originX = (x - this.#mapOffset[0] - this.#tileWidth) / this.#zoom;
        const originY = (y - this.#mapOffset[1] - this.#tileHeight) / this.#zoom;
        let mapX = (originX / this.#halfTileWidth + originY / this.#halfTileHeight - this.mapSize[0]) / 2;
        let mapY = this.mapSize[1] - (originX / this.#halfTileWidth - mapX);
        mapX = Math.floor(mapX + 2);
        mapY = Math.floor(mapY);
        if (x < 0 || y < 0 || mapX >= this.mapSize[0] || mapY >= this.mapSize[1] || mapX < 0 || mapY < 0) {
            return null;
        }
        return [mapX, mapY];
    }

    draw(ctx) {
        // abstract
    }

    redraw() {
        this.#context.clear('#000');

        const entries = Object.entries(this.#layers).filter(([key]) => this.#enabledLayers & Number(key) && Number(key) !== LAYER_TERRAIN)
        const activeLayers = entries.map(([key, layer]) => layer);
        for (const layer of activeLayers) {
            layer.drawBeforeTiles();
        }
        let tiles = this.getTiles();
        if (this.#enabledLayers && LAYER_TERRAIN) {
            this.#layers[LAYER_TERRAIN].drawBeforeTiles();
            for (const tile of tiles) {
                this.#layers[LAYER_TERRAIN].drawTile(tile, this.#hoverCell && this.#hoverCell[0] === tile.mapX && this.#hoverCell[1] === tile.mapY);
            }
            this.#layers[LAYER_TERRAIN].drawAfterTiles();
            tiles = this.getTiles();
        }
        for (const tile of tiles) {
            for (const layer of activeLayers) {
                layer.drawTile(tile, this.#hoverCell && this.#hoverCell[0] === tile.mapX && this.#hoverCell[1] === tile.mapY);
            }
        }
        for (const layer of activeLayers) {
            layer.drawAfterTiles();
        }
        this.draw(this.#context);
        return this.#canvas.getImage();
    }

    * getDrawOrder() {
        for (let line = 0; line < this.mapSize[0] + 1; line++) {
            for (let x = 0; x < line; x++) {
                const y = line - x - 1;
                if (x < this.mapSize[0] && y < this.mapSize[1]) {
                    yield {x, y};
                }
            }
        }
        for (let line = this.mapSize[0] - 1; line > 0; --line) {
            for (let n = 0; n < line; n++) {
                const x = (this.mapSize[0] - line) + n;
                const y = this.mapSize[0] - n - 1;
                if (x < this.mapSize[0] && y < this.mapSize[1]) {
                    yield {x, y};
                }
            }
        }
    }
    
    isTileVisible(drawX, drawY) {
        // return Math.random() * 10 > 5;
        const x = drawX + this.#mapOffset[0];
        const y = drawY + this.#mapOffset[1];
        const border = -300;
        if (
          x > border && y > border &&
          x < this.#visibleAreaSize[0] - border && y < this.#visibleAreaSize[1] - border
        ) {
            return true;
        }
    }
    
    * getTiles(flags = null) {
        const order = this.getDrawOrder();
        for (const { x: mapX, y: mapY } of order) {
            const [drawX, drawY, drawW, drawH] = this.toCordinates(mapX, mapY);
            if (!this.isTileVisible(drawX, drawY)) {
                continue;
            }
            const res = this.get(mapX, mapY);
            const {tile, terrain} = res;
            if (tile === 0 && terrain === 0) {
                continue;
            }
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
     * Повертає комбіновану інформацію про клітинку
     *
     * @param mapX
     * @param mapY
     * @returns {{elevation: *, edge: *, offset: number, tileSize: number, tile: *, terrain: *, mapY, mapX}|null}
     */
    get(mapX, mapY) {
        const offset = this.getOffset(mapX, mapY);
        if (offset === null || offset < 0 || offset > this.#data.map.length - 1) {
            return null;
        }
        const [tile, terrain, random, minimapInfo] = this.#data.map[offset];
        let tileSize = 1;
        if (minimapInfo & TILE_SIZE_2X) {
            tileSize = 2;
        }
        if (minimapInfo & TILE_SIZE_3X) {
            tileSize = 3;
        }
        if (minimapInfo & TILE_SIZE_4X) {
            tileSize = 4;
        }
        if (minimapInfo & TILE_SIZE_5X) {
            tileSize = 5;
        }
        return {
            mapX, mapY,
            offset,
            tileSize,
            tile,
            terrain,
            random,
            minimapInfo
        };
    }

    set(mapX, mapY, { tileId, terrain, minimapInfo }) {
        const offset = this.getOffset(mapX, mapY);
        if (offset === null) {
            return null;
        }
        let [tile, terrainInfo, random, minimap] = this.#data.map[offset];
        if (typeof tileId !== 'undefined') {
            tile = tileId;
        }
        if (typeof terrain !== 'undefined') {
            terrainInfo = terrain;
        }
        if (typeof minimapInfo !== 'undefined') {
            minimap = minimapInfo;
        }
        this.#data.map[offset] = [tile, terrainInfo, random, minimap];
    }

    getOffset(x, y) {
        return y * this.mapSize[0] + x;
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

    mouseMove(mapX, mapY) {
        this.#hoverCell = [mapX, mapY];

        if (this.#layers[LAYER_GRID]) {
            this.#layers[LAYER_GRID].mouseMove(mapX, mapY);
        }
        if (this.#selectedAreaTool) {
            this.#selectedAreaTool.mouseMove(this, [mapX, mapY]);
        }
        if (this.#selectedAreaTool) {
            this.#selectedAreaTool.prepareAction(this.#selectedArea);
        }

        // for (const walker of this.walkers.walkers) {
        //     walker.isHovered = false;
        // }

        // const [mapX, mapY] = this.fromCordinates(x, y);
        // const people = this.walkers.findByXY(mapX, mapY);
        // if (people.length) {
        //     for (const person of people) {
        //         person.hover();
        //     }
        // }
    }
    
    rebuildRoad() {
        this.#layers[LAYER_ROAD].rebuildTiles();
    }
    
    tick() {
        this.#gameState.tick();
    }
    
    addBuilding(building) {
        return this.#gameState.addBuilding(building);
    }

    addFigure(walker) {
        return this.#gameState.addFigure(walker);
    }

    getPath(start, dest) {
        const path = new Path(start, dest);
        return path.buildPath(this, { direction: true });
    }

    doAction(action) {
        this.state.doAction(action);
        console.info(action);
        switch (action.code) {
            case ACTION_CLEAR:
                for (const tile of action.tiles) {
                    const tileRes = this.#layers[LAYER_TERRAIN].getRandomTerrain(tile.random);
                    this.set(tile.mapX, tile.mapY, {
                        tileId: getIdByTile(tileRes),
                        edgeData: EDGE_OCCUPIED,
                        minimapInfo: TILE_SIZE_1X,
                        terrain: TERRAIN_NONE
                    });
                }
                break;
        }
    }
}
