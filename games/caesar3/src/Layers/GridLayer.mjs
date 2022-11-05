import AbstractLayer from './AbstractLayer.mjs';
import { MAX_MAP_SIZE } from '../constants.mjs';

export default
class GridLayer extends AbstractLayer {
    #grid = null;

    #selectedTile = null;

    mouseMove(x, y) {
        this.#selectedTile = this.map.fromCordinates(x, y);
    }

    drawLayer() {
        const { drawWidth, drawHeight, tileHeight, tileWidth } = this.map;
        const toCordinates = this.map.toCordinates.bind(this.map);
        const halfTileWidth = tileWidth / 2;
        const halfTileHeight = tileHeight / 2;

        if (!this.#grid) {
            const mapSize = this.map.size;
            const [x1, y1] = toCordinates(0, 0);
            const [x2, y2] = toCordinates(0, mapSize);
            const [x3, y3] = toCordinates(mapSize, mapSize);
            const [x4, y4] = toCordinates(mapSize, 0);

            this.#grid = [
                { x1: drawWidth / 2, y1: 0, x2: drawWidth / 2, y2: tileHeight },
                { x1: drawWidth / 2, y1: drawHeight - tileHeight, x2: drawWidth / 2, y2: drawHeight },
                { x1: 0, y1: drawHeight / 2, x2: tileWidth, y2: drawHeight / 2 },
                { x1: drawWidth, y1: drawHeight / 2, x2: drawWidth - tileWidth, y2: drawHeight / 2 },
                { x1: x1, y1: y1, x2: x2, y2: y2 },
                { x1: x2, y1: y2, x2: x3, y2: y3 },
                { x1: x3, y1: y3, x2: x4, y2: y4 },
                { x1: x4, y1: y4, x2: x1, y2: y1 }
            ];
            for (let x = 0; x <= mapSize; x++) {
                const [x1, y1] = toCordinates(x, 0);
                const [x2, y2] = toCordinates(x, mapSize);
                this.#grid.push({
                    x1: x1, y1: y1,
                    x2: x2, y2: y2
                });
                if (x % 2 === 0) {
                    this.drawingContext.drawText(`(${x},${0})`, x, 0, { color: '#fff', size: 12 });
                }
            }
            for (let y = 0; y <= mapSize; y++) {
                const [x1, y1] = toCordinates(0, y);
                const [x2, y2] = toCordinates(mapSize, y);
                this.#grid.push({
                    x1: x1, y1: y1,
                    x2: x2, y2: y2
                });
            }
        }
        this.drawingContext.lines(this.#grid);

        // windrose
        const wrX = this.#grid[4].x2 + 300;
        const wrY = this.#grid[4].y2 - 300;
        this.drawingContext.drawText('N', wrX, wrY, { color: "#fff" });
        this.drawingContext.drawText('S', wrX - this.map.tileWidth * 4, wrY + this.map.tileHeight * 4, { color: "#fff" });
        this.drawingContext.drawText('W', wrX - this.map.tileWidth * 3, wrY - this.map.tileHeight, { color: "#fff" });
        this.drawingContext.drawText('E', wrX - this.map.tileWidth, wrY + this.map.tileHeight * 4, { color: "#fff" });

        if (this.#selectedTile) {
            const res = toCordinates(this.#selectedTile[0], this.#selectedTile[1]);
            if (res) {
                const [x, y] = res;
                this.drawingContext.ctx.fillStyle = 'red';
                this.drawingContext.ctx.beginPath();
                this.drawingContext.ctx.moveTo(x, y);
                this.drawingContext.ctx.lineTo(x - halfTileWidth, y + halfTileHeight);
                this.drawingContext.ctx.lineTo(x, y + tileHeight);
                this.drawingContext.ctx.lineTo(x + halfTileWidth, y + halfTileHeight);
                this.drawingContext.ctx.fill();
                this.drawingContext.drawText(`(${this.#selectedTile[0]},${this.#selectedTile[1]})`, x - halfTileWidth, y + halfTileHeight, { color: '#fff', size: 10 });
            }
        }
    }
}
