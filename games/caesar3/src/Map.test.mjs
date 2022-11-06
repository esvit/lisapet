import Map from './Map.mjs';

describe('test', () => {
    const WIDTH = 20;
    const HEIGHT = 10;
    const di = {
        scope: () => ({
            set: () => {},
            get: () => {}
        })
    };
    let map;

    beforeEach(() => {
        map = new Map(di, {
            mapWidth: 160,
            tileId: [],
            terrainInfo: [],
            heightInfo: [],
            edgeData: []
        }, WIDTH, HEIGHT);
        map.mapWidth = 160;
        map.halfSize = 80;
        map.initMap();
    });

    test('toCordinates', () => {
        expect(map.toCordinates(0, 0)).toEqual([1620, 10, WIDTH, HEIGHT]);
        expect(map.toCordinates(0, 159)).toEqual([30, 805, WIDTH, HEIGHT]);
        expect(map.toCordinates(1, 159)).toEqual([40, 810, WIDTH, HEIGHT]);
        expect(map.toCordinates(2, 159)).toEqual([50, 815, WIDTH, HEIGHT]);
        expect(map.toCordinates(0, 159)).toEqual([30, 805, WIDTH, HEIGHT]);
        expect(map.toCordinates(1, 159)).toEqual([40, 810, WIDTH, HEIGHT]);
        expect(map.toCordinates(159, 0)).toEqual([3210, 805, WIDTH, HEIGHT]);
        expect(map.toCordinates(159, 159)).toEqual([1620, 1600, WIDTH, HEIGHT]);
    });

    test('fromCordinates', () => {
        expect(map.fromCordinates(3210, 805)).toEqual(null);
        expect(map.fromCordinates(1620, 10)).toEqual(null);
        expect(map.fromCordinates(30, 805)).toEqual([87, 134]);
        expect(map.fromCordinates(3220, 810)).toEqual(null);
        expect(map.fromCordinates(1620, 1610)).toEqual(null);
    });

    test('fromCordinates zoom', () => {
        const WIDTH = 58;
        const HEIGHT = 30;
        const map = new Map(di, {
            mapWidth: 160,
            tileId: [],
            terrainInfo: [],
            heightInfo: [],
            edgeData: []
        }, WIDTH, HEIGHT);
        map.mapWidth = 160;
        map.halfSize = 80;
        map.initMap();
        let zoom = 1;
        Object.defineProperty(map, 'windowWidth', { get: () => 1636 });
        Object.defineProperty(map, 'windowHeight', { get: () => 495 });
        Object.defineProperty(map, 'drawWidth', { get: () => 162 * 58 * zoom });
        Object.defineProperty(map, 'drawHeight', { get: () => 162 * 30 * zoom });

        expect(map.drawWidth).toEqual(9396);

        map.move(-3912, -30);
        map.mapBorder = 1;
        zoom = 1;
        map.zoom = 1;
        expect(map.fromCordinates(785, 21)).toEqual([0, 0]);

        zoom = 0.5;
        map.zoom = 0.5;
        expect(map.drawWidth).toEqual(4698);
        expect(map.move(map.mapOffset[0] + 1886, map.mapOffset[1] + 15)).toEqual([-1208, -15]);
        expect(map.fromCordinates(1698, 0)).toEqual([0, 0]);
    });

    test('getNeighbors', () => {
        const WIDTH = 20;
        const HEIGHT = 10;
        const mapData = {
            tileId: new Array(162 * 162),
            terrainInfo: new Array(162 * 162),
            edgeData: new Array(162 * 162),
            heightInfo: new Array(162 * 162),
        };
        mapData.tileId[80 * 162 + 80 - 1] = 'W';
        mapData.tileId[80 * 162 + 80 + 1] = 'E';
        mapData.tileId[(80 - 1) * 162 + 80] = 'N';
        mapData.tileId[(80 + 1) * 162 + 80] = 'S';

        mapData.terrainInfo[80 * 162 + 80 - 1] = 'W';
        mapData.terrainInfo[80 * 162 + 80 + 1] = 'E';
        mapData.terrainInfo[(80 - 1) * 162 + 80] = 'N';
        mapData.terrainInfo[(80 + 1) * 162 + 80] = 'S';

        mapData.edgeData[80 * 162 + 80 - 1] = 'W';
        mapData.edgeData[80 * 162 + 80 + 1] = 'E';
        mapData.edgeData[(80 - 1) * 162 + 80] = 'N';
        mapData.edgeData[(80 + 1) * 162 + 80] = 'S';

        mapData.heightInfo[80 * 162 + 80 - 1] = 'W';
        mapData.heightInfo[80 * 162 + 80 + 1] = 'E';
        mapData.heightInfo[(80 - 1) * 162 + 80] = 'N';
        mapData.heightInfo[(80 + 1) * 162 + 80] = 'S';

        const map = new Map(di, mapData, WIDTH, HEIGHT);
        map.mapWidth = 160;
        map.halfSize = 80;
        map.initMap();

        expect(map.getNeighbors(80, 80)).toEqual([
            {
                "direction": 8,
                "edge": "W",
                "elevation": "W",
                "mapX": 79,
                "mapY": 80,
                "offset": 13039,
                "terrain": "W",
                "tile": "W"
            },
            {
                "direction": 2,
                "edge": "E",
                "elevation": "E",
                "mapX": 81,
                "mapY": 80,
                "offset": 13041,
                "terrain": "E",
                "tile": "E"
            },
            {
                "direction": 1,
                "edge": "N",
                "elevation": "N",
                "mapX": 80,
                "mapY": 79,
                "offset": 12878,
                "terrain": "N",
                "tile": "N"
            },
            {
                "direction": 4,
                "edge": "S",
                "elevation": "S",
                "mapX": 80,
                "mapY": 81,
                "offset": 13202,
                "terrain": "S",
                "tile": "S"
            }
        ]);
    });
});
