import { pad } from '../helpers/math.mjs';

export default
class AbstractLayer {
    constructor(map, di) {
        this.map = map;
        this.di = di;
        this.drawingContext = di.get('DrawingContext');
        this.resourceManager = di.get('ResourceManager');
    }

    drawBeforeTiles() {
        // draw before all
    }

    drawTile() {
        // abstract
    }

    drawAfterTiles() {
        // draw after all
    }

    drawTileSprite(tile, name) {
        const { drawX, drawY, drawW, drawH, tileSize = 1 } = tile;

        const tileName = Array.isArray(name) ? `${name[0]}_${pad(name[1], 5)}` : name;
        const sprite = this.resourceManager.getByAtlas(tileName);
        if (sprite) {
            const [img, tileX, tileY, tileW, tileH] = sprite;
            let x = drawX - drawW / 2;
            let y = drawY - drawH - (tileH - drawH) + drawH / 2 * tileSize + drawH / 2;

            this.drawingContext.drawSprite(
                img,
                tileX, tileY, tileW, tileH,
                x, y, tileW, tileH
            );
        }
    }

    drawColorTile(mapX, mapY, color) {
        const { tileHeight, tileWidth } = this.map;
        const halfTileWidth = tileWidth / 2;
        const halfTileHeight = tileHeight / 2;
        const res = this.map.toCordinates(mapX, mapY);
        if (!res) {
            return;
        }
        const [x, y] = res;
        const ctx = this.drawingContext.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - halfTileWidth, y + halfTileHeight);
        ctx.lineTo(x, y + tileHeight);
        ctx.lineTo(x + halfTileWidth, y + halfTileHeight);
        ctx.fill();
        return [x, y];
    }
}
