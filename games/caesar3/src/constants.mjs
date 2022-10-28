export const MAX_MAP_SIZE = 160;
export const MAP_SIZE_AND_BORDER = MAX_MAP_SIZE + 2;
export const MAP_MOVE_BORDER = 50; // Зона краю коли почне рухатись карта по курсору

export const LAYER_TERRAIN = 2;
export const LAYER_ROAD = 4;
export const LAYER_GRID = 0x8000;

export const DIRECTION_NONE = 0;
export const DIRECTION_NORTH = 1;
export const DIRECTION_EAST = 2;
export const DIRECTION_SOUTH = 4;
export const DIRECTION_WEST = 8;

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
export const TERRAIN_RUBBLE = 0x1000;
export const TERRAIN_FOUNTAIN_RANGE = 0x2000;
export const TERRAIN_WALL = 0x4000;
export const TERRAIN_GATEHOUSE = 0x8000;
export const TERRAIN_NONE = 5;

export const TERRAIN_WALL_OR_GATEHOUSE = TERRAIN_WALL | TERRAIN_GATEHOUSE;
export const TERRAIN_NOT_CLEAR = 0xd77f;
export const TERRAIN_CLEARABLE = 0xd17f;
export const TERRAIN_IMPASSABLE = 0xc75f;
export const TERRAIN_IMPASSABLE_ENEMY = 0x1237;
export const TERRAIN_IMPASSABLE_WOLF = 0xd73f;
export const TERRAIN_ALL = 0xffff;
