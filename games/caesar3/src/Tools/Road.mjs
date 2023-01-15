import AbstractTool from './AbstractTool.mjs';
import { TERRAIN_NONE, TERRAIN_ROAD, TOOLS_ROAD } from '../constants.mjs';
import { astar, Graph } from '../helpers/astar.mjs';

export default class Road extends AbstractTool {
    #buildedPath = null;

    get name() {
        return TOOLS_ROAD;
    }

    prepareArea(map, area) {
        const areaForSearch = [];
        for (let x = area.start[0]; x <= area.end[0]; x++) {
            const row = [];
            for (let y = area.start[1]; y <= area.end[1]; y++) {
                const { terrain } = map.get(x, y);
                let score = 0;
                if (terrain === TERRAIN_NONE) {
                    score = 1;
                }
                if (terrain === TERRAIN_ROAD) {
                    score = 2;
                }
                row.push(score);
            }
            areaForSearch.push(row);
        }
        const graph = new Graph(areaForSearch);
        const startX = area.startPoint[0] - area.start[0];
        const startY = area.startPoint[1] - area.start[1];
        const endX = area.endPoint[0] - area.start[0]
        const endY = area.endPoint[1] - area.start[1];
        const pointA = graph.grid[startX][startY];
        const pointB = graph.grid[endX][endY];
        const [start, end] = startX > endX ? [pointA, pointB] : [pointB, pointA];

        this.#buildedPath = astar.search(graph, start, end, { closest: true, diagonal: false }).map((node) => ({
            x: node.x + area.start[0],
            y: node.y + area.start[1],
        }));
    }

    drawPreviewCell(layer, mapX, mapY, tile) {
        const cell = this.#buildedPath.find(({ x, y }) => x === mapX && y === mapY);
        if (cell) {
            const tileRes = layer.getRandomTerrain(tile.random);
            layer.drawTileSprite({ ...tile, tileSize: 1 }, tileRes);
            
            layer.drawTileSprite({
                ...tile,
                tileSize: 1
            }, 'land2a_00094');
            return true;
        }
    }

    changeCell(map, mapX, mapY) {
        const cell = this.#buildedPath.find(({ x, y }) => x === mapX && y === mapY);
        if (cell) {
            map.set(mapX, mapY, {
                tileId: 641,
                terrain: TERRAIN_ROAD
            });
        }
    }
}
