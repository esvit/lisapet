import {
    DIRECTION_EAST, DIRECTION_NONE,
    DIRECTION_NORTH,
    DIRECTION_SOUTH,
    DIRECTION_WEST,
    TERRAIN_NONE,
    TERRAIN_ROAD
} from "./constants.mjs";
import {astar, Graph} from "./helpers/astar.mjs";

export default class Path {
    #start = null;

    #end = null;

    #startPoint = null;

    #endPoint = null;

    constructor(start, end) {
        this.#startPoint = start;
        this.#endPoint = end;

        this.#start = [];
        this.#end = [];

        this.#start[0] = start[0] <= end[0] ? start[0] : end[0];
        this.#end[0] = start[0] > end[0] ? start[0] : end[0];

        this.#start[1] = start[1] <= end[1] ? start[1] : end[1];
        this.#end[1] = start[1] > end[1] ? start[1] : end[1];
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get startPoint() {
        return this.#startPoint;
    }

    get endPoint() {
        return this.#endPoint;
    }

    inArea(x, y) {
        if (x < this.#start[0] || x > this.#end[0]) {
            return false;
        }
        return !(y < this.#start[1] || y > this.#end[1]);
        
    }

    * getCoordinates() {
        for (let x = this.#start[0]; x <= this.#end[0]; x++) {
            for (let y = this.#start[1]; y <= this.#end[1]; y++) {
                yield [x, y];
            }
        }
    }

    getCells(map) {
        const areaForSearch = [];
        for (let x = this.start[0]; x <= this.end[0]; x++) {
            const row = [];
            for (let y = this.start[1]; y <= this.end[1]; y++) {
                row.push(map.get(x, y));
            }
            areaForSearch.push(row);
        }
        return areaForSearch;
    }

    buildPath(map) {
        const areaForSearch = this.getCells(map).map((row) => {
            return row.map(({ terrain }) => {
                if (terrain === TERRAIN_NONE) {
                    return 1;
                } else if (terrain === TERRAIN_ROAD) {
                    return 2;
                } else {
                    return 0;
                }
            });
        });
        const graph = new Graph(areaForSearch);
        const startX = this.startPoint[0] - this.start[0];
        const startY = this.startPoint[1] - this.start[1];
        const endX = this.endPoint[0] - this.start[0]
        const endY = this.endPoint[1] - this.start[1];
        const pointA = graph.grid[startX][startY];
        const pointB = graph.grid[endX][endY];
        const [start, end] = startX > endX ? [pointA, pointB] : [pointB, pointA];

        let path = astar.search(graph, start, end, { closest: true, diagonal: false });
        path = path.map((node) => {
            const mapX = node.x + this.start[0];
            const mapY = node.y + this.start[1];
            const neighbors = this.getNeighbors(path, node.x, node.y);
            let direction = DIRECTION_NONE;
            for (const nTile of neighbors) {
                direction |= nTile.direction;
            }
            const mapNeighbors = map.getNeighbors(mapX, mapY);
            for (const nTile of mapNeighbors) {
                if (nTile.terrain & TERRAIN_ROAD) {
                    direction |= nTile.direction;
                }
            }
            return {
                x: mapX,
                y: mapY,
                direction
            };
        });
        return path;
    }

    getNeighbors(tiles, x, y) {
        const leftTile = tiles.find((t) => t.x === x - 1 && t.y === y);
        const rightTile = tiles.find((t) => t.x === x + 1 && t.y === y);
        const topTile = tiles.find((t) => t.x === x && t.y === y - 1);
        const bottomTile = tiles.find((t) => t.x === x && t.y === y + 1);
        const res = [];
        if (leftTile) {
            res.push({ direction: DIRECTION_WEST, ...leftTile });
        }
        if (rightTile) {
            res.push({ direction: DIRECTION_EAST, ...rightTile });
        }
        if (topTile) {
            res.push({ direction: DIRECTION_NORTH, ...topTile });
        }
        if (bottomTile) {
            res.push({ direction: DIRECTION_SOUTH, ...bottomTile });
        }
        return res;
    }
}
