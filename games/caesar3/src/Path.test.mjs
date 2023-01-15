import Path from './Path.mjs';
import { TERRAIN_NONE } from './constants.mjs';

describe('Path', () => {
    test('swap coordinates', () => {
        let area = new Path([0, 0], [2, 2]);

        expect(area.start).toEqual([0, 0]);
        expect(area.end).toEqual([2, 2]);

        area = new Path([2, 2], [0, 0]);

        expect(area.start).toEqual([0, 0]);
        expect(area.end).toEqual([2, 2]);

        area = new Path([2, 0], [0, 2]);

        expect(area.start).toEqual([0, 0]);
        expect(area.end).toEqual([2, 2]);
    });
    test('in area', () => {
        let area = new Path([0, 0], [2, 2]);

        expect(area.inArea(0, 0)).toBeTruthy();
        expect(area.inArea(1, 0)).toBeTruthy();
        expect(area.inArea(2, 2)).toBeTruthy();
        expect(area.inArea(3, 2)).toBeFalsy();
        expect(area.inArea(3, 3)).toBeFalsy();
    });
    test('buildPath', () => {
        let area = new Path([0, 0], [3, 4]);

        area.getCells = () => {
            return [
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
            ];
        }
        expect(area.buildPath({})).toEqual([]);
    });
});
