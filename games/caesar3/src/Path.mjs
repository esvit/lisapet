import {
    DIRECTION_EAST, DIRECTION_NONE,
    DIRECTION_NORTH,
    DIRECTION_SOUTH,
    DIRECTION_WEST,
    TERRAIN_ROAD
} from "./constants.mjs";
import {astar, Graph} from "./helpers/astar.mjs";
import {
    FIGURE_DIRECTION_BOTTOM, FIGURE_DIRECTION_BOTTOM_LEFT,
    FIGURE_DIRECTION_BOTTOM_RIGHT, FIGURE_DIRECTION_LEFT, FIGURE_DIRECTION_NONE,
    FIGURE_DIRECTION_RIGHT,
    FIGURE_DIRECTION_TOP, FIGURE_DIRECTION_TOP_LEFT,
    FIGURE_DIRECTION_TOP_RIGHT
} from "./constants/figures.mjs";

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
        // for (let x = this.start[0]; x <= this.end[0]; x++) {
        //     const row = [];
        //     for (let y = this.start[1]; y <= this.end[1]; y++) {
        //         row.push(map.get(x, y));
        //     }
        //     areaForSearch.push(row);
        // }
        for (let y = 0; y < map.mapSize[1]; y++) {
            const row = [];
            for (let x = 0; x < map.mapSize[0]; x++) {
                row.push(map.get(y, x));
            }
            areaForSearch.push(row);
        }
        return areaForSearch;
    }

    buildPath(map, { occupied, direction, mapOccupied } = {}, validTerritory = 0, points = {}) {
        const areaForSearch = this.getCells(map).map((row) => {
            return row.map(({ terrain }) => {
                for (const point in points) {
                    if (terrain & Number(point)) {
                        return points[point];
                    }
                }
                if (terrain === 0) {
                    return 1000;
                }
                return (terrain & validTerritory) ? 1000 : 0;
            });
        });
        const graph = new Graph(areaForSearch);
        const startX = this.startPoint[0];// - this.start[0];
        const startY = this.startPoint[1];// - this.start[1];
        const endX = this.endPoint[0];// - this.start[0]
        const endY = this.endPoint[1];// - this.start[1];
        const pointA = graph.grid[startX][startY];
        const pointB = graph.grid[endX][endY];
        const isSwap = startX > endX;
        const [start, end] = isSwap ? [pointA, pointB] : [pointB, pointA];
        window.pathFinder = graph.grid;

        console.info(this.startPoint, this.endPoint,graph, graph.grid[this.startPoint[0]][startY], this.getCells(map)[this.startPoint[0]][startY]);
        let path = astar.search(graph, start, end, { closest: true, diagonal: false });
        let prevPoint = null;
        if (!isSwap) {
            path = path.reverse();
        }
        window.pathFinded = path;
        path = path.map((node) => {
            const mapX = node.x;// + this.start[0];
            const mapY = node.y;// + this.start[1];
            const item = {
                x: mapX,
                y: mapY
            };
            if (direction) {
                item.direction = prevPoint ? Path.getDirection(
                  [prevPoint.x, prevPoint.y], 
                  [mapX, mapY]
                ) : FIGURE_DIRECTION_NONE;
            }
            if (occupied) {
                const neighbors = this.getNeighbors(path, node.x, node.y);
                item.occupied = DIRECTION_NONE;
                for (const nTile of neighbors) {
                    item.occupied |= nTile.direction;
                }
                if (mapOccupied) {
                    const mapNeighbors = map.getNeighbors(mapX, mapY);
                    for (const nTile of mapNeighbors) {
                        if (nTile.terrain & TERRAIN_ROAD) {
                            item.occupied |= nTile.direction;
                        }
                    }
                }
            }
            prevPoint = item;
            return item;
        });
        console.info(path)
        return path;
    }
    
    static getDirection([srcX, srcY], [distX, distY]) {
        if (srcX < distX) {
            if (srcY > distY) {
                return FIGURE_DIRECTION_TOP_RIGHT;
            } else if (srcY === distY) {
                return FIGURE_DIRECTION_RIGHT;
            } else if (srcY < distY) {
                return FIGURE_DIRECTION_BOTTOM_RIGHT;
            }
        } else if (srcX === distX) {
            if (srcY > distY) {
                return FIGURE_DIRECTION_TOP;
            } else if (srcY < distY) {
                return FIGURE_DIRECTION_BOTTOM;
            }
        } else if (srcX > distX) {
            if (srcY > distY) {
                return FIGURE_DIRECTION_TOP_LEFT;
            } else if (srcY === distY) {
                return FIGURE_DIRECTION_LEFT;
            } else if (srcY < distY) {
                return FIGURE_DIRECTION_BOTTOM_LEFT;
            }
        }
        return FIGURE_DIRECTION_NONE;
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
