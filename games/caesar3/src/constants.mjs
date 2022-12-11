export const MAX_MAP_SIZE = 160;
export const MAP_SIZE_AND_BORDER = MAX_MAP_SIZE + 2;
export const MAP_MOVE_BORDER = 50; // Зона краю коли почне рухатись карта по курсору
export const MAX_WALKERS = 1000;

export const LAYER_TERRAIN = 2;
export const LAYER_ROAD = 4;
export const LAYER_NATURE = 8;
export const LAYER_COLOR = 0x4000;
export const LAYER_GRID = 0x8000;

export const LAYERS = [
    { id: LAYER_TERRAIN, title: 'Terrain' },
    { id: LAYER_ROAD, title: 'Road' },
    { id: LAYER_NATURE, title: 'Nature' },
    { id: LAYER_COLOR, title: 'Colors' },
    { id: LAYER_GRID, title: 'Grid' },
];

export const DIRECTION_NONE = 0;
export const DIRECTION_NORTH = 1;
export const DIRECTION_EAST = 2;
export const DIRECTION_SOUTH = 4;
export const DIRECTION_WEST = 8;

const NORTH_ATLAS = 'atlases/north1.atlas';
const MAIN_ATLAS = 'atlases/main1.atlas';
const CITIZEN1_ATLAS = 'atlases/citizen1.atlas';
const CARTS_ATLAS = 'atlases/carts.atlas';
const GOVT_ATLAS = 'atlases/govt1.atlas';
const UTILITYA_ATLAS = 'atlases/utilitya1.atlas';

export const RESOURCE_ATLASES = [
    MAIN_ATLAS,
    CITIZEN1_ATLAS,
    CARTS_ATLAS,
    GOVT_ATLAS,
    UTILITYA_ATLAS
];

/**
 * Опис типів місцевості, згідно з https://esvit.notion.site/Caesar-3-Terrain-Elements-b19e64fa5ec3443d95ff34a4dc842760
 * @type {number}
 */
export const TERRAIN_TREE = 1;
export const TERRAIN_ROCK = 2;
export const TERRAIN_WATER = 4;
export const TERRAIN_BUILDING = 8;
export const TERRAIN_SHRUB = 0x10;
export const TERRAIN_GARDEN = 0x20;
export const TERRAIN_ROAD = 0x40;
export const TERRAIN_RESERVOIR_RANGE = 0x80;
export const TERRAIN_AQUEDUCT = 0x100;
export const TERRAIN_ELEVATION = 0x200;
export const TERRAIN_ACCESS_RAMP = 0x400;
export const TERRAIN_MEADOW = 0x800;
export const TERRAIN_RUBBLE = 0x1000; // уламки будівлі
export const TERRAIN_FOUNTAIN_RANGE = 0x2000;
export const TERRAIN_WALL = 0x4000;
export const TERRAIN_GATEHOUSE = 0x8000;

export const EDGE_NOT_OCCUPIED = 0x0;
export const EDGE_OCCUPIED = 0x40;

// special
export const TERRAIN_NONE = 0;
export const TERRAIN_WALL_OR_GATEHOUSE = TERRAIN_WALL | TERRAIN_GATEHOUSE;
// 0xd77f
export const TERRAIN_NOT_CLEAR = TERRAIN_TREE | TERRAIN_ROCK | TERRAIN_WATER | TERRAIN_BUILDING | TERRAIN_SHRUB
                                | TERRAIN_GARDEN | TERRAIN_ROAD | TERRAIN_AQUEDUCT | TERRAIN_ELEVATION | TERRAIN_ACCESS_RAMP
                                | TERRAIN_RUBBLE | TERRAIN_WALL | TERRAIN_GATEHOUSE;
// 0xd17f
export const TERRAIN_CLEARABLE  = TERRAIN_TREE | TERRAIN_BUILDING | TERRAIN_SHRUB
                                | TERRAIN_GARDEN | TERRAIN_ROAD | TERRAIN_AQUEDUCT
                                | TERRAIN_RUBBLE | TERRAIN_WALL | TERRAIN_GATEHOUSE;

export const TERRAIN_IMPASSABLE = 0xc75f;
export const TERRAIN_IMPASSABLE_ENEMY = 0x1237;
export const TERRAIN_IMPASSABLE_WOLF = 0xd73f;
export const TERRAIN_ALL = 0xffff;

export const TERRAIN_TYPES = [
    { id: TERRAIN_TREE, title: 'Tree' },
    { id: TERRAIN_ROCK, title: 'Rock' },
    { id: TERRAIN_WATER, title: 'Water' },
    { id: TERRAIN_BUILDING, title: 'Building' },
    { id: TERRAIN_SHRUB, title: 'Shrub' },
    { id: TERRAIN_GARDEN, title: 'Garden' },
    { id: TERRAIN_ROAD, title: 'Road' },
    { id: TERRAIN_RESERVOIR_RANGE, title: 'Reservoir range' },
    { id: TERRAIN_AQUEDUCT, title: 'Aqueduct' },
    { id: TERRAIN_ELEVATION, title: 'Elevation' },
    { id: TERRAIN_ACCESS_RAMP, title: 'Access ramp' },
    { id: TERRAIN_MEADOW, title: 'Meadow' },
    { id: TERRAIN_RUBBLE, title: 'Rubble' },
    { id: TERRAIN_FOUNTAIN_RANGE, title: 'Fountain range' },
    { id: TERRAIN_WALL, title: 'Wall' },
    { id: TERRAIN_GATEHOUSE, title: 'Gatehouse' },
];

// розміри спрайтів, зберігаються в minimapInfo
export const TILE_SIZE_1X = 0;
export const TILE_SIZE_2X = 1;
export const TILE_SIZE_3X = 2;


export const TOOLS_HOUSE = 'house';
export const TOOLS_SHOVEL = 'shovel';
export const TOOLS_ROAD = 'road';


export const WALKER_DIRECTION_NORTH = 1;
export const WALKER_DIRECTION_NORTH_EAST = 2;
export const WALKER_DIRECTION_EAST = 3;
export const WALKER_DIRECTION_SOUTH_EAST = 4;
export const WALKER_DIRECTION_SOUTH = 5;
export const WALKER_DIRECTION_SOUTH_WEST = 6;
export const WALKER_DIRECTION_WEST = 7;
export const WALKER_DIRECTION_NORTH_WEST = 8;

export const WALKER_CART_BEHIND = 0;
export const WALKER_CART_FRONT = 1;

export const ANIMATION_SLIDES = 11;
export const MAX_DIRECTION_NUMBER = 8;
export const MAX_ANIMATIONS_NUMBER = 104;

// citizen01
export const WALKER_PLAIN_CITIZEN = 0;
export const WALKER_BATH_WORKER = 1; // блондинка
export const WALKER_PRIEST = 2; // священик
export const WALKER_TAXER = 3; // податківець
export const WALKER_GLADIATOR = 4; // градіатор
// const WALKER_PRIEST = 5; // градіатор (удар кнутом)
// const WALKER_TAXER = 6; // податки
export const WALKER_SCHOOL_CHILD = 7; // дитина зі школи
export const WALKER_MARKET_LADY = 8; // продавчиня
export const WALKER_WORKER = 9; // різноробочий
export const WALKER_IMMIGRANT = 10; // імігрант
export const WALKER_ENGINEER = 11; // інженер
