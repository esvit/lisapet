import Path from './Path.mjs';
import {TERRAIN_NONE, TERRAIN_ROAD} from './constants.mjs';
import {
    FIGURE_DIRECTION_BOTTOM, FIGURE_DIRECTION_BOTTOM_RIGHT,
    FIGURE_DIRECTION_LEFT,
    FIGURE_DIRECTION_RIGHT,
    FIGURE_DIRECTION_TOP, FIGURE_DIRECTION_TOP_LEFT
} from "./constants/figures.mjs";

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
    test('getDirection', () => {
        expect(Path.getDirection([0, 0], [0, 1])).toEqual(FIGURE_DIRECTION_BOTTOM);
        expect(Path.getDirection([0, 0], [1, 0])).toEqual(FIGURE_DIRECTION_RIGHT);
        expect(Path.getDirection([0, 1], [0, 0])).toEqual(FIGURE_DIRECTION_TOP);
        expect(Path.getDirection([1, 0], [0, 0])).toEqual(FIGURE_DIRECTION_LEFT);
        expect(Path.getDirection([0, 0], [1, 1])).toEqual(FIGURE_DIRECTION_BOTTOM_RIGHT);
        expect(Path.getDirection([1, 1], [0, 0])).toEqual(FIGURE_DIRECTION_TOP_LEFT);

        expect(Path.getDirection([1, 25], [2, 25])).toEqual(FIGURE_DIRECTION_RIGHT);
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
        expect(area.buildPath({})).toEqual([
            {"x": 0, "y": 0}, 
            {"x": 0, "y": 1},
            {"x": 1, "y": 1},
            {"x": 2, "y": 1},
            {"x": 2, "y": 2},
            {"x": 2, "y": 3},
            {"x": 2, "y": 4}
        ]);

        area.getCells = () => {
            return [
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_ROAD }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_ROAD }, { terrain: TERRAIN_ROAD }, { terrain: TERRAIN_ROAD }, { terrain: TERRAIN_ROAD }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_ROAD }, { terrain: TERRAIN_NONE }],
              [{ terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }, { terrain: TERRAIN_NONE }],
            ];
        }
        expect(area.buildPath({})).toEqual([
            {"x": 0, "y": 0}, 
            {"x": 0, "y": 1},
            {"x": 0, "y": 2},
            {"x": 0, "y": 3},
            {"x": 0, "y": 4},
            {"x": 1, "y": 4},
            {"x": 2, "y": 4}
        ]);
    });
});
