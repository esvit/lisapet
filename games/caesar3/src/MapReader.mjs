import { MAP_SIZE_AND_BORDER } from './constants.mjs';
import { STRUCT_TYPES } from './helpers/reader.mjs';
import { PKStream } from './helpers/pkzip.mjs';

const MAP_INFO = {
    // 0x33420  8    ????
    _u0: STRUCT_TYPES.byte(8),

    // 0x33428	8	Camera X and Y position, 4 byte integer each
    cameraX: STRUCT_TYPES.int(),
    cameraY: STRUCT_TYPES.int(),

    // 0x33430	2	Starting date, negative for BC
    startDate: STRUCT_TYPES.int(),

    // 0x33434	1	Empire location, 00 = Lugdunum, etc
    location: STRUCT_TYPES.byte(10),

    // 0x3343e	160	20 requests, divided into 4 parts of 20 shorts: (1) years into mission, (2) good ID, (3) amount, (4) time to fulfill in months
    requests: STRUCT_TYPES.short(80),

    // 0x334de	200	20 invasions, divided into 5 parts of 20 shorts: (1) years into mission, (2) type: 0 = none, 1 = barbarian, 2 = enemy, 3 = distant battle, (3) number of invaders, (4) attack point, 0-7 or 8 for random, (5) attack: 0 = food, 1 = gold, 2 = buildings, 3 = troops, 4 = random
    invasions: STRUCT_TYPES.short(100),
    _u1: STRUCT_TYPES.short(),

    // 0x335a8	4	Starting funds
    startingFunds: STRUCT_TYPES.int(),

    // 0x335ac	4	Enemy nationality
    enemyNationality: STRUCT_TYPES.int(),

    _u2: STRUCT_TYPES.int(),

    // 0x335b4	8	Map width and height, both integers, both should be the same value
    mapWidth: STRUCT_TYPES.int(), // Map width and height, both integers, both should be the same value
    mapHeight: STRUCT_TYPES.int(), // Map width and height, both integers, both should be the same value
    _u3: STRUCT_TYPES.int(),
    _u4: STRUCT_TYPES.int(),

    name: STRUCT_TYPES.char(24),

    // 0x335c4	24	Brief description
    briefDescription: STRUCT_TYPES.char(582),

    // 0x33822	1	Image ID
    imageId: STRUCT_TYPES.int(),

    // 0x33826	1	Rank: 0 = citizen, etc
    rank: STRUCT_TYPES.short(),

    // 0x33828	16	Herd points, split up in 2 chunks of 4 shorts each. First chunk is X coordinate, second is Y coordinates
    herdPoints: STRUCT_TYPES.short(8),
    _u5: STRUCT_TYPES.byte(120),

    // 0x338b0	100	Price changes, 1x 20 shorts plus 3x 20 bytes. (1) year, (2) good ID, (3) amount, (4) 0 = fall, 1 = rise
    priceChanges1: STRUCT_TYPES.short(20),
    priceChanges2a: STRUCT_TYPES.byte(20),
    priceChanges2b: STRUCT_TYPES.byte(20),
    priceChanges2c: STRUCT_TYPES.byte(20),
    _u6: STRUCT_TYPES.byte(20),

    // 0x33928	44	Special events. In order: gladiator revolt flag, gladiator revolt year, change of Emperor flag, change of Emperor year, sea / land trade problem flags, Rome raises / lowers wages flags, contaminated water flag, iron mine collapse flag, and clay pit flooded flag
    specialEvents: STRUCT_TYPES.byte(44),

    // 0x33954	32	Fishing points, see herd points
    fishingPoints: STRUCT_TYPES.short(16),

    // 0x33974	20	Requests: favour gained
    favourGained: STRUCT_TYPES.byte(20),
    _u7: STRUCT_TYPES.byte(100),

    // 0x339ec	2	Rome supplies wheat flag
    wheatFlag: STRUCT_TYPES.short(),
    _u8: STRUCT_TYPES.byte(4),

    // 0x339f2	94	Short flags: enable/disable buildings
    disableBuildings: STRUCT_TYPES.byte(98),

    // 0x33a54	16	Rating requirements (integers): culture, prosperity, peace, favor
    ratingRequirements: STRUCT_TYPES.short(8),

    // 0x33a64	4	Flags whether ratings are required: culture, prosperity, peace, favor
    whetherFlags: STRUCT_TYPES.byte(4), // Flags whether ratings are required: culture, prosperity, peace, favor

    // 0x33a68	8	Flag and value in years, integer each: Time limit (losing time)
    limitTime: STRUCT_TYPES.short(4),

    // 0x33a70	8	Flag and value in years, integer each: Survival time (winning time)
    survivalTime: STRUCT_TYPES.short(4),

    // 0x33a78	8	Earthquake type and year, integer each. Type: 0 = none, 1 = minor, 2 = average, 3 = major
    earthquake: STRUCT_TYPES.int(2),

    // 0x33a80	8	Flag and value, integer each: population requirement
    populationRequirement: STRUCT_TYPES.int(2),

    // 0x33a88	4	Earthquake point, X and Y coordinates, short each
    earthquakePoint: STRUCT_TYPES.short(2),

    // 0x33a8c	8	People entry and exit point
    peopleEntryPoint: STRUCT_TYPES.short(4),

    // 0x33a94	32	8 invasion points, see fish points
    invasionPoints: STRUCT_TYPES.short(16),

    // 0x33ab4	8	River entry and exit point
    riverEntryPoint: STRUCT_TYPES.short(4),

    // 0x33abc	4	Rescue loan
    rescueLoan: STRUCT_TYPES.int(),

    // 0x33ac0	12	3 milestones: 25%, 50%, 75%
    milestones: STRUCT_TYPES.int(3),

    _u9: STRUCT_TYPES.byte(12),

    // 0x33ad8	1	Climate: 0 = central, 1 = northern, 2 = desert
    climate: STRUCT_TYPES.byte(),

    // 0x33ad9	2	Flag: flotsam on
    flotsamOn: STRUCT_TYPES.short()
};

const MAP_STRUCT = {
    // 0x0	52488	Short grid, graphic IDs. Each ID corresponds to a different graphic element / building
    tileId: STRUCT_TYPES.short(MAP_SIZE_AND_BORDER * MAP_SIZE_AND_BORDER),
    // 0xcd08	26244	Byte grid, edge data
    edgeData: STRUCT_TYPES.byte(MAP_SIZE_AND_BORDER * MAP_SIZE_AND_BORDER),

    // 0x1338c	52488	Short grid, terrain data
    terrainInfo: STRUCT_TYPES.short(MAP_SIZE_AND_BORDER * MAP_SIZE_AND_BORDER),

    // 0x20094	26244	Byte grid, related to "randomness" in terrain. 00 or 20 (hex), 01 or 21 for 2x2 buildings, etc
    minimapInfo: STRUCT_TYPES.byte(MAP_SIZE_AND_BORDER * MAP_SIZE_AND_BORDER),

    // 0x26718	26244	Byte grid, random numbers used for, among others: merging houses, tile appearance, minimap colours
    randomNumbers: STRUCT_TYPES.byte(MAP_SIZE_AND_BORDER * MAP_SIZE_AND_BORDER),

    // 0x2cd9c	26244	Byte grid, indicates the elevation level: 0 for the "ground" level, 1 for the first elevation level, 2 for the second, and so on
    heightInfo: STRUCT_TYPES.byte(MAP_SIZE_AND_BORDER * MAP_SIZE_AND_BORDER),

    ...MAP_INFO
};

export default
class MapReader {
    constructor(buffer) {
        const stream = new PKStream(buffer);
        stream.seek(4); //

        const type = stream.readInt();
        if (type === 0x66) {
            stream.seek(0);
            this.readSavedMap(stream);
        } else {
            stream.seek(0);
            this.readScenario(stream);
        }
    }

    readSavedMap(stream) {
        stream.seek(8);
        this.tileId = stream.readCompressedShorts(); // buildings, 162 x 162 x 2 bytes
        this.edgeData = stream.readCompressedBytes(); // edges, 162 x 162 x 1 bytes
        const ids = stream.readCompressedShorts(); // building IDs
        this.terrainInfo = stream.readCompressedShorts(); // terrain types, 162 x 162 x 2 bytes
        stream.skipCompressed(); // unknown
        this.heightInfo = stream.readCompressedBytes(); // unknown
        this.minimapInfo = stream.readCompressedBytes();
        stream.skipCompressed(); // unknown
        this.randomNumbers = stream.readByte(26244); // unknown (pseudo-random numbers seeds?)
        stream.skipCompressed(); // unknown
        stream.skipCompressed(); // unknown
        stream.skipCompressed(); // unknown
        stream.skipCompressed(); // unknown
        stream.skipCompressed(); // unknown
        const walkers = stream.readCompressedBytes(); // walkers, 1000 x 128 bytes
        stream.skipCompressed(); // unknown
        stream.skipCompressed(); // unknown, 600 x 500 bytes
        stream.skipCompressed(); // unknown, 50 x 128 bytes
        stream.readByte(12); // unknown, 3 ints
        stream.skipCompressed(); // city treasury, savings, etc.; rest unknown
        const name = stream.readChar(70); // governor name; rest unknown
        stream.skipCompressed(); // buildings, 2000 x 128 bytes
        stream.readByte(208); // unknown
        stream.skipCompressed(); // empire map cities, 41 x 66 bytes

        const someInfo = stream.readByte(384);
        for (const key in MAP_INFO) {
            this[key] = MAP_INFO[key](stream);
        }

        // console.info(this);
        // const scenarioSettings = stream.readByte(2188); // scenario settings (similar to .map file), Start of data copied from the .map file!
        // const messages = stream.readCompressedBytes(); // messages from your scribes, 1000 x 16 bytes
        // const unknown16 = stream.readByte(206); // unknown
        // const unknown17 = stream.readCompressedBytes(); // unknown

    }

    readScenario(stream) {
        for (const key in MAP_STRUCT) {
            this[key] = MAP_STRUCT[key](stream);
        }
        console.info(this);
    }
}
