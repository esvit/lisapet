import AbstractLayer from './AbstractLayer.mjs';

describe('AbstractLayer', () => {
    test('Draw tiles', () => {
        const layer = new AbstractLayer({}, {
            get: () => {}
        });
        layer.resourceManager = { getByAtlas: () => ([null, 0, 0, 58, 30]) };
        layer.drawingContext = {
            drawSprite: (img, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drahH) => {
                expect([drawX, drawY, drawW, drahH]).toEqual([15, 15, 58, 30]);
            }
        };
        let tile = { drawX: 15, drawY: 15, drawW: 58, drawH: 30 };
        layer.drawTile(tile, 'name1');

        // layer.resourceManager = { getByAtlas: () => ([null, 0, 0, 118, 76]) };
        // layer.drawingContext = {
        //     drawSprite: (img, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drahH) => {
        //         expect([drawX, drawY, drawW, drahH]).toEqual([15, 15, 118, 76]);
        //     }
        // };
        // tile = { drawX: 15, drawY: 15, drawW: 58, drawH: 30 };
        // layer.drawTile(tile, 'name2');

        layer.resourceManager = { getByAtlas: () => ([null, 0, 0, 58, 53]) };
        layer.drawingContext = {
            drawSprite: (img, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drahH) => {
                expect([drawX, drawY, drawW, drahH]).toEqual([15, -8, 58, 53]);
            }
        };
        tile = { drawX: 15, drawY: 15, drawW: 58, drawH: 30 };
        layer.drawTile(tile, 'land3a_00085');

        layer.resourceManager = { getByAtlas: () => ([null, 0, 0, 58, 49]) };
        layer.drawingContext = {
            drawSprite: (img, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drahH) => {
                expect([drawX, drawY, drawW, drahH]).toEqual([15, 15, 58, 49]);
            }
        };
        tile = { drawX: 15, drawY: 15, drawW: 58, drawH: 30 };
        layer.drawTile(tile, 'land3a_00087');
    });
});
