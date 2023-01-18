export const MAP_MOVE_BORDER = 50; // Зона краю коли почне рухатись карта по курсору

export const LAYER_TERRAIN = 2;
export const LAYER_ROAD = 4;
export const LAYER_BUILDINGS = 8;
export const LAYER_FIGURES = 16;
export const LAYER_COLOR = 0x4000;
export const LAYER_GRID = 0x8000;

export const LAYERS = [
    { id: LAYER_TERRAIN, title: 'Terrain' },
    { id: LAYER_ROAD, title: 'Road' },
    { id: LAYER_BUILDINGS, title: 'Buildings' },
    { id: LAYER_FIGURES, title: 'Figures' },
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
const CITIZEN2_ATLAS = 'atlases/citizen2.atlas';
const CARTS_ATLAS = 'atlases/carts.atlas';
const GOVT_ATLAS = 'atlases/govt1.atlas';
const UTILITYA_ATLAS = 'atlases/utilitya1.atlas';

export const RESOURCE_ATLASES = [
    MAIN_ATLAS,
    CITIZEN1_ATLAS,
    CITIZEN2_ATLAS,
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

export const TERRAIN_PATH_ROAD = TERRAIN_ROAD | TERRAIN_MEADOW;
export const TERRAIN_PATH_IMMIGRANT = TERRAIN_TREE | TERRAIN_ROCK | TERRAIN_WATER | TERRAIN_BUILDING | TERRAIN_SHRUB
                                | TERRAIN_GARDEN | TERRAIN_RUBBLE | TERRAIN_WALL;
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
export const TILE_SIZE_4X = 4;
export const TILE_SIZE_5X = 8;


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
export const WALKER_GOVERNOR = 3; // податківець
export const WALKER_GLADIATOR = 4; // градіатор
// const WALKER_PRIEST = 5; // градіатор (удар кнутом)
export const WALKER_TAXER = 6; // податки
export const WALKER_SCHOOL_CHILD = 7; // дитина зі школи
export const WALKER_MARKET_LADY = 8; // продавчиня
export const WALKER_CART_PUSHER = 9; // різноробочий
export const WALKER_IMMIGRANT = 10; // імігрант
export const WALKER_ENGINEER = 11; // інженер

// data, do not change
export const MAX_REQUESTS = 20;
export const MAX_INVASIONS = 20;
export const MAX_HERD_POINTS = 4;
export const MAX_DEMAND_CHANGES = 20;
export const MAX_PRICE_CHANGES = 20;
export const MAX_FISH_POINTS = 8;
export const MAX_INVASION_POINTS = 8;
export const MAX_ALLOWED_BUILDINGS = 50;
export const MAX_MESSAGES = 1000;
export const MAX_MESSAGE_CATEGORIES = 20;
export const MAX_BUILDINGS = 2000;
export const MAX_WALKERS = 1000;
export const INVENTORY_MAX = 8; // 8 типів продуктів
export const RESOURCE_MAX = 16;
export const MAX_PATH_LENGTH = 500;

export const BUILDING_NONE = 0;
export const BUILDING_MENU_FARMS = 2;
export const BUILDING_MENU_RAW_MATERIALS = 3;
export const BUILDING_MENU_WORKSHOPS = 4;
export const BUILDING_ROAD = 5;
export const BUILDING_WALL = 6;
export const BUILDING_DRAGGABLE_RESERVOIR = 7;
export const BUILDING_AQUEDUCT = 8;
export const BUILDING_CLEAR_LAND = 9;
export const BUILDING_HOUSE_VACANT_LOT = 10;
export const BUILDING_HOUSE_SMALL_TENT = 10;
export const BUILDING_HOUSE_LARGE_TENT = 11;
export const BUILDING_HOUSE_SMALL_SHACK = 12;
export const BUILDING_HOUSE_LARGE_SHACK = 13;
export const BUILDING_HOUSE_SMALL_HOVEL = 14;
export const BUILDING_HOUSE_LARGE_HOVEL = 15;
export const BUILDING_HOUSE_SMALL_CASA = 16;
export const BUILDING_HOUSE_LARGE_CASA = 17;
export const BUILDING_HOUSE_SMALL_INSULA = 18;
export const BUILDING_HOUSE_MEDIUM_INSULA = 19;
export const BUILDING_HOUSE_LARGE_INSULA = 20;
export const BUILDING_HOUSE_GRAND_INSULA = 21;
export const BUILDING_HOUSE_SMALL_VILLA = 22;
export const BUILDING_HOUSE_MEDIUM_VILLA = 23;
export const BUILDING_HOUSE_LARGE_VILLA = 24;
export const BUILDING_HOUSE_GRAND_VILLA = 25;
export const BUILDING_HOUSE_SMALL_PALACE = 26;
export const BUILDING_HOUSE_MEDIUM_PALACE = 27;
export const BUILDING_HOUSE_LARGE_PALACE = 28;
export const BUILDING_HOUSE_LUXURY_PALACE = 29;
export const BUILDING_AMPHITHEATER = 30;
export const BUILDING_THEATER = 31;
export const BUILDING_HIPPODROME = 32;
export const BUILDING_COLOSSEUM = 33;
export const BUILDING_GLADIATOR_SCHOOL = 34;
export const BUILDING_LION_HOUSE = 35;
export const BUILDING_ACTOR_COLONY = 36;
export const BUILDING_CHARIOT_MAKER = 37;
export const BUILDING_PLAZA = 38;
export const BUILDING_GARDENS = 39;
export const BUILDING_FORT_LEGIONARIES = 40;
export const BUILDING_SMALL_STATUE = 41;
export const BUILDING_MEDIUM_STATUE = 42;
export const BUILDING_LARGE_STATUE = 43;
export const BUILDING_FORT_JAVELIN = 44;
export const BUILDING_FORT_MOUNTED = 45;
export const BUILDING_DOCTOR = 46;
export const BUILDING_HOSPITAL = 47;
export const BUILDING_BATHHOUSE = 48;
export const BUILDING_BARBER = 49;
export const BUILDING_DISTRIBUTION_CENTER_UNUSED = 50;
export const BUILDING_SCHOOL = 51;
export const BUILDING_ACADEMY = 52;
export const BUILDING_LIBRARY = 53;
export const BUILDING_FORT_GROUND = 54;
export const BUILDING_PREFECTURE = 55;
export const BUILDING_TRIUMPHAL_ARCH = 56;
export const BUILDING_FORT = 57;
export const BUILDING_GATEHOUSE = 58;
export const BUILDING_TOWER = 59;
export const BUILDING_SMALL_TEMPLE_CERES = 60;
export const BUILDING_SMALL_TEMPLE_NEPTUNE = 61;
export const BUILDING_SMALL_TEMPLE_MERCURY = 62;
export const BUILDING_SMALL_TEMPLE_MARS = 63;
export const BUILDING_SMALL_TEMPLE_VENUS = 64;
export const BUILDING_LARGE_TEMPLE_CERES = 65;
export const BUILDING_LARGE_TEMPLE_NEPTUNE = 66;
export const BUILDING_LARGE_TEMPLE_MERCURY = 67;
export const BUILDING_LARGE_TEMPLE_MARS = 68;
export const BUILDING_LARGE_TEMPLE_VENUS = 69;
export const BUILDING_MARKET = 70;
export const BUILDING_GRANARY = 71;
export const BUILDING_WAREHOUSE = 72;
export const BUILDING_WAREHOUSE_SPACE = 73;
export const BUILDING_SHIPYARD = 74;
export const BUILDING_DOCK = 75;
export const BUILDING_WHARF = 76;
export const BUILDING_GOVERNORS_HOUSE = 77;
export const BUILDING_GOVERNORS_VILLA = 78;
export const BUILDING_GOVERNORS_PALACE = 79;
export const BUILDING_MISSION_POST = 80;
export const BUILDING_ENGINEERS_POST = 81;
export const BUILDING_LOW_BRIDGE = 82;
export const BUILDING_SHIP_BRIDGE = 83;
export const BUILDING_SENATE = 84;
export const BUILDING_SENATE_UPGRADED = 85;
export const BUILDING_FORUM = 86;
export const BUILDING_FORUM_UPGRADED = 87;
export const BUILDING_NATIVE_HUT = 88;
export const BUILDING_NATIVE_MEETING = 89;
export const BUILDING_RESERVOIR = 90;
export const BUILDING_FOUNTAIN = 91;
export const BUILDING_WELL = 92;
export const BUILDING_NATIVE_CROPS = 93;
export const BUILDING_MILITARY_ACADEMY = 94;
export const BUILDING_BARRACKS = 95;
export const BUILDING_MENU_SMALL_TEMPLES = 96;
export const BUILDING_MENU_LARGE_TEMPLES = 97;
export const BUILDING_ORACLE = 98;
export const BUILDING_BURNING_RUIN = 99;
export const BUILDING_WHEAT_FARM = 100;
export const BUILDING_VEGETABLE_FARM = 101;
export const BUILDING_FRUIT_FARM = 102;
export const BUILDING_OLIVE_FARM = 103;
export const BUILDING_VINES_FARM = 104;
export const BUILDING_PIG_FARM = 105;
export const BUILDING_MARBLE_QUARRY = 106;
export const BUILDING_IRON_MINE = 107;
export const BUILDING_TIMBER_YARD = 108;
export const BUILDING_CLAY_PIT = 109;
export const BUILDING_WINE_WORKSHOP = 110;
export const BUILDING_OIL_WORKSHOP = 111;
export const BUILDING_WEAPONS_WORKSHOP = 112;
export const BUILDING_FURNITURE_WORKSHOP = 113;
export const BUILDING_POTTERY_WORKSHOP = 114;
export const BUILDING_ROADBLOCK = 115;
export const BUILDING_WORKCAMP = 116;
export const BUILDING_GRAND_TEMPLE_CERES = 117;
export const BUILDING_GRAND_TEMPLE_NEPTUNE = 118;
export const BUILDING_GRAND_TEMPLE_MERCURY = 119;
export const BUILDING_GRAND_TEMPLE_MARS = 120;
export const BUILDING_GRAND_TEMPLE_VENUS = 121;
export const BUILDING_MENU_GRAND_TEMPLES = 122;
export const BUILDING_MENU_TREES = 123;
export const BUILDING_MENU_PATHS = 124;
export const BUILDING_MENU_PARKS = 125;
export const BUILDING_SMALL_POND = 126;
export const BUILDING_LARGE_POND = 127;
export const BUILDING_PINE_TREE = 128;
export const BUILDING_FIR_TREE = 129;
export const BUILDING_OAK_TREE = 130;
export const BUILDING_ELM_TREE = 131;
export const BUILDING_FIG_TREE = 132;
export const BUILDING_PLUM_TREE = 133;
export const BUILDING_PALM_TREE = 134;
export const BUILDING_DATE_TREE = 135;
export const BUILDING_PINE_PATH = 136;
export const BUILDING_FIR_PATH = 137;
export const BUILDING_OAK_PATH = 138;
export const BUILDING_ELM_PATH = 139;
export const BUILDING_FIG_PATH = 140;
export const BUILDING_PLUM_PATH = 141;
export const BUILDING_PALM_PATH = 142;
export const BUILDING_DATE_PATH = 143;
export const BUILDING_PAVILION_BLUE = 144;
export const BUILDING_PAVILION_RED = 145;
export const BUILDING_PAVILION_ORANGE = 146;
export const BUILDING_PAVILION_YELLOW = 147;
export const BUILDING_PAVILION_GREEN = 148;
export const BUILDING_SMALL_STATUE_ALT = 149;
export const BUILDING_SMALL_STATUE_ALT_B = 150;
export const BUILDING_OBELISK = 151;
export const BUILDING_PANTHEON = 152;
export const BUILDING_ARCHITECT_GUILD = 153;
export const BUILDING_MESS_HALL = 154;
export const BUILDING_LIGHTHOUSE = 155;
export const BUILDING_MENU_STATUES = 156;
export const BUILDING_MENU_GOV_RES = 157;
export const BUILDING_TAVERN = 158;
export const BUILDING_GRAND_GARDEN = 159;
export const BUILDING_ARENA = 160;
export const BUILDING_HORSE_STATUE = 161;
export const BUILDING_DOLPHIN_FOUNTAIN = 162;
export const BUILDING_HEDGE_DARK = 163;
export const BUILDING_HEDGE_LIGHT = 164;
export const BUILDING_GARDEN_WALL = 165;
export const BUILDING_LEGION_STATUE = 166;
export const BUILDING_DECORATIVE_COLUMN = 167;
export const BUILDING_COLONNADE = 168;
export const BUILDING_LARARIUM = 169;
export const BUILDING_NYMPHAEUM = 170;
export const BUILDING_SMALL_MAUSOLEUM = 171;
export const BUILDING_LARGE_MAUSOLEUM = 172;
export const BUILDING_WATCHTOWER = 173;
export const BUILDING_PALISADE = 174;
export const BUILDING_GARDEN_PATH = 175;
export const BUILDING_CARAVANSERAI = 176;
export const BUILDING_ROOFED_GARDEN_WALL = 177;
export const BUILDING_GARDEN_WALL_GATE = 178;
export const BUILDING_HEDGE_GATE_DARK = 179;
export const BUILDING_HEDGE_GATE_LIGHT = 180;
export const BUILDING_PALISADE_GATE = 181;
export const BUILDING_GLADIATOR_STATUE = 182;
// helper constants
export const BUILDING_TYPE_MAX = 183;

export const BUILDING_STATE_UNUSED = 0;
export const BUILDING_STATE_IN_USE = 1;
export const BUILDING_STATE_UNDO = 2;
export const BUILDING_STATE_CREATED = 3;
export const BUILDING_STATE_RUBBLE = 4;
export const BUILDING_STATE_DELETED_BY_GAME = 5; // used for earthquakes, fires, house mergers
export const BUILDING_STATE_DELETED_BY_PLAYER = 6;
export const BUILDING_STATE_MOTHBALLED = 7;
