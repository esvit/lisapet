import fs from 'fs';
import MapReader from './MapReader.mjs';

describe('MapReader', () => {
    test('First test case', () => {
        const buffer = fs.readFileSync(`${process.cwd()}/../tools/tests/empty_scenario.map`).toString('binary');
        expect(buffer.length).toBe(211692);

        const reader = new MapReader(buffer);
        const { map } = reader;
        expect(map.scenario.name).toBe('Conquest of fertile landsh cliffside');
        expect(map.scenario.mapWidth).toBe(160);
        expect(map.scenario.mapHeight).toBe(160);
        expect(map.scenario.climate).toBe(0);
        expect(map.scenario.flotsamEnabled).toBe(1);
    })

    test('Test case', () => {
        const buffer = fs.readFileSync(`${process.cwd()}/../tools/tests/saved_game.sav`).toString('binary');
        const reader = new MapReader(buffer);
        const { map } = reader;
        expect(map.scenario.name).toBe('Demo Map2');
        expect(map.scenario.mapWidth).toBe(60);
        expect(map.scenario.mapHeight).toBe(60);
        expect(map.scenario.climate).toBe(0);
        expect(map.scenario.flotsamEnabled).toBe(1);
    });
});
