export default
class AbstractLayer {
    constructor(map, di) {
        this.map = map;
        this.di = di;
        this.drawingContext = di.get('DrawingContext');
        this.resourceManager = di.get('ResourceManager');
    }

    drawTile(tile, name) {
        const { drawX, drawY, drawW, drawH, tileSize = 1 } = tile;

        const sprite = this.resourceManager.getByAtlas(name);
        if (sprite) {
            const [img, tileX, tileY, tileW, tileH] = sprite;
            let x = drawX - drawW / 2;
            let y = drawY - drawH - (tileH - drawH) + drawH / 2 * tileSize + drawH / 2;
            // if (name === 'land2a_00093')
            // console.info(tileSize)
            // let y = drawY + drawH + drawH - tileH + (h - 1) * drawH / 2;

            this.drawingContext.drawSprite(
                img,
                tileX, tileY, tileW, tileH,
                x, y, tileW, tileH
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
