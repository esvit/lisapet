import fs from 'fs';
import MapReader from './MapReader.mjs';

describe('MapReader', () => {
    test('First test case', () => {
        const buffer = fs.readFileSync(`${process.cwd()}/../assets/maps/Brigantium.map`).toString('binary');
        expect(buffer.length).toBe(211692);

        const map = new MapReader(buffer);
        expect(map.name).toBe('Conquest of fertile land');
        expect(map.mapWidth).toBe(160);
        expect(map.mapHeight).toBe(160);
        expect(map.climate).toBe(0);
        expect(map.flotsamOn).toBe(1);
    });
});
