import { pad } from '../helpers/math.mjs';
import {
  ANIMATION_SLIDES,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  MAX_ANIMATIONS_NUMBER,
  MAX_DIRECTION_NUMBER,
  TERRAIN_PATH_IMMIGRANT,
  TERRAIN_ROAD,
  WALKER_CART_BEHIND,
  WALKER_CART_FRONT,
  WALKER_DIRECTION_EAST,
  WALKER_DIRECTION_NORTH,
  WALKER_DIRECTION_NORTH_EAST,
  WALKER_DIRECTION_NORTH_WEST,
  WALKER_DIRECTION_SOUTH,
  WALKER_DIRECTION_SOUTH_EAST,
  WALKER_DIRECTION_SOUTH_WEST,
  WALKER_DIRECTION_WEST
} from '../constants.mjs';
import {
  FIGURE_DIRECTION_TOP,
  FIGURE_DIRECTION_TOP_RIGHT,
  FIGURE_DIRECTION_RIGHT,
  FIGURE_DIRECTION_BOTTOM_RIGHT,
  FIGURE_DIRECTION_BOTTOM,
  FIGURE_DIRECTION_BOTTOM_LEFT,
  FIGURE_DIRECTION_LEFT,
  FIGURE_DIRECTION_TOP_LEFT
} from "../constants/figures.mjs";
import EventEmitter from '../../../../src/EventEmitter.mjs';
import Path from "../Path.mjs";

const MOVING_MATRIX = {
  [WALKER_DIRECTION_NORTH]: [-0.7, 0.7],
  [WALKER_DIRECTION_NORTH_EAST]: [-1, 0],
  [WALKER_DIRECTION_EAST]: [0.7, -0.7],
  [WALKER_DIRECTION_SOUTH_EAST]: [0, +1],
  [WALKER_DIRECTION_SOUTH]: [0.7, -0.7],
  [WALKER_DIRECTION_SOUTH_WEST]: [-1, 0],
  [WALKER_DIRECTION_WEST]: [+0.7, +0.7],
  [WALKER_DIRECTION_NORTH_WEST]: [0, +1],
};

// citizen01
const WALKER_PLAIN_CITIZEN = 0;
const WALKER_BATH_WORKER = 1; // блондинка
const WALKER_PRIEST = 2; // священик
const WALKER_TAXER = 3; // податківець
const WALKER_GLADIATOR = 4; // градіатор
// const WALKER_PRIEST = 5; // градіатор (удар кнутом)
// const WALKER_TAXER = 6; // податки
const WALKER_SCHOOL_CHILD = 7; // дитина зі школи
const WALKER_MARKET_LADY = 8; // продавчиня
const WALKER_WORKER = 9; // різноробочий
const WALKER_IMMIGRANT = 10; // імігрант
const WALKER_ENGINEER = 11; // інженер

export default
class Figure extends EventEmitter {
  #map = null;

  #x = null;
  #y = null;

  #path = [];

  #cart = null;

  #destination = null;

  #slide = 2;

  directions = [];

  isHovered = false;
  
  #waitTicks= 0;

  direction = 2;
  progressOnTile = 0;

  constructor(map, x, y) {
    super();
    this.#map = map;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get destination() {
    return this.#destination;
  }

  set destination(val) {
    this.#destination = val;
  }

  get cart() {
    return this.#cart;
  }

  set cart(val) {
    this.#cart = val;
    this.#cart.walker = this;
  }
  
  waitFor(ticks) {
    this.#waitTicks = ticks;
  }

  move(dest) {
    const hW = this.#map.tileWidth / 2;
    const hH = this.#map.tileHeight / 2;

    const path = new Path([this.#x, this.#y], dest);
    this.#path = path.buildPath(this.#map, { direction: true }, TERRAIN_PATH_IMMIGRANT,{
      [TERRAIN_ROAD]: 10
    });
    
    const point = this.#path.shift();
    console.info( this.#path, point)
    this.#x = point.x;
    this.#y = point.y;
  }

  hover() {
    this.isHovered = true;
  }
  
  drawDebugPath(layer) {
    for (const point of this.#path) {
      const [drawX, drawY, drawW, drawH] = this.#map.toCordinates(point.x, point.y, true);
      layer.drawTileSprite({ drawX, drawY, drawW, drawH }, `debug_${pad(point.direction, 5)}`);
    }
  }

  draw(layer, tile) {
    if (this.#waitTicks > 0) {
      return;
    }
    const x = tile.drawX - this.#map.tileWidth / 2 + this.tileProgressX;
    const y = tile.drawY - this.#map.tileHeight / 2 + this.tileProgressY;
    const drawCartBehindFirst = [
      FIGURE_DIRECTION_RIGHT,
      FIGURE_DIRECTION_TOP_RIGHT,
      FIGURE_DIRECTION_TOP,
      FIGURE_DIRECTION_TOP_LEFT
    ];
    // layer.drawingContext.drawRect(tile.drawX, tile.drawY, tile.drawW, tile.drawH);
    const isCartFirst = this.#cart
      && (
        (this.#cart.cartPosition === WALKER_CART_BEHIND && drawCartBehindFirst.includes(this.direction))
        ||
        (this.#cart.cartPosition === WALKER_CART_FRONT && !drawCartBehindFirst.includes(this.direction))
      );

    if (isCartFirst && this.#cart) {
      this.#cart.draw(layer, tile, [tile.drawX + this.tileProgressX, tile.drawY + this.tileProgressY]);
    }

    const n = (this.progressOnTile % ANIMATION_SLIDES) * MAX_DIRECTION_NUMBER + this.direction + 1 + (this.spriteNumber * MAX_ANIMATIONS_NUMBER);
    layer.drawTileSprite(tile, `citizen01_${pad(n, 5)}`, [x, y]);
    // const [img, tileX, tileY, tileW, tileH] = resourceManager.getByAtlas(`citizen01_${pad(n, 5)}`);
    // ctx.drawSprite(
    //   img,
    //   tileX, tileY, tileW, tileH,
    //   x, y, tileW, tileH
    // );

    // if (this.isHovered) {
    //   
      // const lines = [];
      // let start = null;
      // for (const point of this.#path) {
      //   if (!start) {
      //     start = point;
      //     continue;
      //   }
      //   lines.push([
      //     start[0] + this.#map.tileWidth / 2,
      //     start[1] + this.#map.tileHeight / 2,
      //     point[0] + this.#map.tileWidth / 2,
      //     point[1] + this.#map.tileHeight / 2
      //   ]);
      //   start = point;
      // }
      // ctx.lines(lines);
      // ctx.drawRect(this.#path[0][0] + this.#map.tileWidth / 2, this.#path[0][1] + this.#map.tileHeight / 2, 5, 5, 'red');
      // this.isHovered = false;
    // }

    if (!isCartFirst && this.#cart) {
      this.#cart.draw(layer, tile, [tile.drawX + this.tileProgressX, tile.drawY + this.tileProgressY]);
    }
  }

  nextAction() {
    const point = this.#path.shift();
    if (point) {
      this.#x = point.x;
      this.#y = point.y;
      this.direction = point.direction;
    } else {
      this.emit('done');
    }
  }

  tick() {
    if (this.#waitTicks > 0) {
      this.#waitTicks--;
      return;
    }

    this.progressOnTile += 1;
    if (this.progressOnTile === 15) {
      this.nextAction();
      this.progressOnTile = 0;
    }
    return;
    if (!this.#path.length) {
      return;
    }
    this.#slide += 1;

    const [x, y] = MOVING_MATRIX[this.direction];
    this.x -= x * 3;
    this.y -= y / 1.93333 * 3;

    const destPoint = this.#path[0];
    const distX = Math.abs(this.x - destPoint[0]);
    const distY = Math.abs(this.y - destPoint[1]);
    if (distX < 10 && distY < 10) {
      this.#path.shift();
    }
    var angleDeg = Math.atan2(destPoint[1] - this.y, destPoint[0] - this.x) * 180 / Math.PI;

    if (angleDeg > -45 && angleDeg < 0) {
      this.direction = WALKER_DIRECTION_NORTH;
    }
    if (angleDeg > -135 && angleDeg < -90) {
      this.direction = WALKER_DIRECTION_NORTH_WEST;
    }
    if (angleDeg > -180 && angleDeg < -135) {
      this.direction = WALKER_DIRECTION_WEST;
    }
    if (angleDeg > 0 && angleDeg < 46) {
      this.direction = WALKER_DIRECTION_NORTH_EAST;
    }
    if (angleDeg > 45 && angleDeg < 90) {
      this.direction = WALKER_DIRECTION_EAST;
    }
    if (angleDeg > 90 && angleDeg < 135) {
      this.direction = WALKER_DIRECTION_SOUTH_EAST;
    }
    if (angleDeg > 135 && angleDeg < 180) {
      this.direction = WALKER_DIRECTION_SOUTH;
    }
    console.info(angleDeg, this.direction)
  }

  get tileProgressX() {
    const { progressOnTile, direction } = this;
    if (progressOnTile >= 15) {
      return 0;
    }
    switch (direction) {
      case FIGURE_DIRECTION_TOP:
      case FIGURE_DIRECTION_RIGHT:
        return 2 * progressOnTile - 28;
      case FIGURE_DIRECTION_TOP_RIGHT:
        return 4 * progressOnTile - 56;
      case FIGURE_DIRECTION_BOTTOM:
      case FIGURE_DIRECTION_LEFT:
        return 28 - 2 * progressOnTile;
      case FIGURE_DIRECTION_BOTTOM_LEFT:
        return 56 - 4 * progressOnTile;
      default:
        return 0;
    }
  }

  get tileProgressY() {
    const { progressOnTile, direction } = this;
    if (progressOnTile >= 15) {
      return 0;
    }
    switch (direction) {
      case FIGURE_DIRECTION_TOP:
      case FIGURE_DIRECTION_LEFT:
        return 14 - progressOnTile;
      case FIGURE_DIRECTION_RIGHT:
      case FIGURE_DIRECTION_BOTTOM:
        return progressOnTile - 14;
      case FIGURE_DIRECTION_BOTTOM_RIGHT:
        return 2 * progressOnTile - 28;
      case FIGURE_DIRECTION_TOP_LEFT:
        return 28 - 2 * progressOnTile;
      default:
        return 0;
    }
  }
}








