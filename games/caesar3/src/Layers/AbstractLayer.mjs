export default
class AbstractLayer {
    constructor(map, di) {
        this.map = map;
        this.di = di;
        this.drawingContext = di.get('DrawingContext');
        this.resourceManager = di.get('ResourceManager');
    }

    drawTile(tile, name) {
        const { drawX, drawY, drawW, drawH } = tile;

        const sprite = this.resourceManager.getByAtlas(name);
        if (sprite) {
            const [img, tileX, tileY, tileW, tileH] = sprite;
            let h = tileH % drawH;
            if (tileH > 50) { // фікс для тайлів більше 1х1
                // h += this.map.tileHeight / 2;
            }
            if (name === 'land3a_00087') {
                console.info(h, drawY, drawH, tileH, drawY + drawH - tileH, tileH)
            }

            this.drawingContext.drawSprite(
                img,
                tileX, tileY, tileW, tileH,
                drawX + drawW - tileW, drawY + drawH - tileH, tileW, tileH
            );
            // if (name === 'land3a_00067' && drawY === 653) {
            //     console.info(((tileH - drawH) / this.map.tileHeight - 0.5));
            //     this.drawingContext.lines([
            //         { x1: drawX, y1: drawY, x2: drawX + tileW, y2: drawY },
            //         { x1: drawX, y1: drawY, x2: drawX, y2: drawY + tileY },
            //
            //         { x1: drawX + tileW, y1: drawY, x2: drawX + tileW, y2: drawY + tileY },
            //         { x1: drawX, y1: drawY + tileY, x2: drawX + tileW, y2: drawY + tileY },
            //     ]);
            // }
        }
    }
}
