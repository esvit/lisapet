import BaseBuilding from './BaseBuilding.mjs';

describe('BaseBuilding', () => {
    test('detectRoad', () => {
        let calls = [];
        const building = new BaseBuilding({
            mapSize: [10, 10],
            get(x, y) {
                calls.push([x, y]);
                return { terrain: 0 };
            }
        }, 0, 0);

        building.detectRoad(1);
        expect(calls).toEqual([
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ]);

        calls = [];

        building.detectRoad(2);
        expect(calls).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 1],
            [1, 2],
            [2, 0],
            [2, 1],
            [2, 2]
        ]);
        
        const building2 = new BaseBuilding({
            mapSize: [10, 10],
            get(x, y) {
                calls.push([x, y]);
                return { terrain: 0 };
            }
        }, 10, 10);

        calls = [];

        building2.detectRoad(2);
        expect(calls).toEqual([
            [8, 8],
            [8, 9],
            [8, 10],
            [9, 8],
            [9, 9],
            [9, 10],
            [10, 8],
            [10, 9], 
            [10, 10]
        ]);
    });
});
