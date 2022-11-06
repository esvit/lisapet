import Area from './Area.mjs';

describe('Area', () => {
    test('swap coordinates', () => {
        let area = new Area([0, 0], [2, 2]);

        expect(area.start).toEqual([0, 0]);
        expect(area.end).toEqual([2, 2]);

        area = new Area([2, 2], [0, 0]);

        expect(area.start).toEqual([0, 0]);
        expect(area.end).toEqual([2, 2]);

        area = new Area([2, 0], [0, 2]);

        expect(area.start).toEqual([0, 0]);
        expect(area.end).toEqual([2, 2]);
    });
    test('in area', () => {
        let area = new Area([0, 0], [2, 2]);

        expect(area.inArea(0, 0)).toBeTruthy();
        expect(area.inArea(1, 0)).toBeTruthy();
        expect(area.inArea(2, 2)).toBeTruthy();
        expect(area.inArea(3, 2)).toBeFalsy();
        expect(area.inArea(3, 3)).toBeFalsy();
    });
});
