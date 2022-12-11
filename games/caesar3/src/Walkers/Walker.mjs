import { pad } from '../helpers/math.mjs';
import {
  ANIMATION_SLIDES, MAX_ANIMATIONS_NUMBER, MAX_DIRECTION_NUMBER,
  WALKER_CART_BEHIND,
  WALKER_CART_FRONT,
  WALKER_DIRECTION_EAST,
  WALKER_DIRECTION_NORTH, WALKER_DIRECTION_NORTH_EAST, WALKER_DIRECTION_NORTH_WEST,
  WALKER_DIRECTION_SOUTH, WALKER_DIRECTION_SOUTH_EAST,
  WALKER_DIRECTION_SOUTH_WEST,
  WALKER_DIRECTION_WEST
} from '../constants.mjs';

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
class Walker {
  #di = null;

  #map = null;

  #resourceManager = null;

  #x = 0;

  #y = 0;

  #direction = WALKER_DIRECTION_NORTH;

  #path = [];

  #cart = null;

  #destination = null;

  #slide = 0;

  constructor({ di, map }) {
    this.#di = di;
    this.#map = map;
    this.#resourceManager = di.get('ResourceManager');
  }

  get direction() {
    return this.#direction;
  }

  set direction(val) {
    this.#direction = val;
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

  move(start, dest) {
    const hW = this.#map.tileWidth / 2;
    const hH = this.#map.tileHeight / 2;
    this.#path = this.#map.getPath(start, dest).map(({ x, y }) => {
      const [a, b] = this.#map.toCordinates(x, y);
      return [a - hW, b - hH];
    });
    const point = this.#path.shift();
    this.#x = point[0];
    this.#y = point[1];
  }

  draw(ctx) {
    const x = this.#x;
    const y = this.#y;
    const drawCartBehindFirst = [
      WALKER_DIRECTION_EAST,
      WALKER_DIRECTION_SOUTH_EAST,
      WALKER_DIRECTION_SOUTH,
      WALKER_DIRECTION_SOUTH_WEST
    ];

    const isCartFirst = this.#cart
      && (
        (this.#cart.cartPosition === WALKER_CART_BEHIND && drawCartBehindFirst.includes(this.#direction))
        ||
        (this.#cart.cartPosition === WALKER_CART_FRONT && !drawCartBehindFirst.includes(this.#direction))
      );

    if (isCartFirst && this.#cart) {
      this.#cart.draw(ctx);
    }

    const n = (this.#slide % ANIMATION_SLIDES) * MAX_DIRECTION_NUMBER + this.#direction + (this.spriteNumber * MAX_ANIMATIONS_NUMBER);
    const [img, tileX, tileY, tileW, tileH] = this.#resourceManager.getByAtlas(`citizen01_${pad(n, 5)}`);
    ctx.drawSprite(
      img,
      tileX, tileY, tileW, tileH,
      x, y, tileW, tileH
    );

    if (true) {
      const lines = [];
      let start = null;
      for (const point of this.#path) {
        if (!start) {
          start = point;
          continue;
        }
        lines.push([
          start[0] + this.#map.tileWidth / 2,
          start[1] + this.#map.tileHeight / 2,
          point[0] + this.#map.tileWidth / 2,
          point[1] + this.#map.tileHeight / 2
        ]);
        start = point;
      }
      ctx.lines(lines);
      ctx.drawRect(this.#path[0][0] + this.#map.tileWidth / 2, this.#path[0][1] + this.#map.tileHeight / 2, 5, 5, 'red');
    }

    if (!isCartFirst && this.#cart) {
      this.#cart.draw(ctx);
    }
  }

  tick() {
    if (!this.#path.length) {
      return;
    }
    this.#slide += 1;

    const [x, y] = MOVING_MATRIX[this.#direction];
    this.#x -= x * 3;
    this.#y -= y / 1.93333 * 3;

    const destPoint = this.#path[0];
    const distX = Math.abs(this.#x - destPoint[0]);
    const distY = Math.abs(this.#y - destPoint[1]);
    if (distX < 10 && distY < 10) {
      this.#path.shift();
    }
    var angleDeg = Math.atan2(destPoint[1] - this.#y, destPoint[0] - this.#x) * 180 / Math.PI;

    if (angleDeg > -45 && angleDeg < 0) {
      this.#direction = WALKER_DIRECTION_NORTH;
    }
    if (angleDeg > -135 && angleDeg < -90) {
      this.#direction = WALKER_DIRECTION_NORTH_WEST;
    }
    if (angleDeg > -180 && angleDeg < -135) {
      this.#direction = WALKER_DIRECTION_WEST;
    }
    if (angleDeg > 0 && angleDeg < 46) {
      this.#direction = WALKER_DIRECTION_NORTH_EAST;
    }
    if (angleDeg > 45 && angleDeg < 90) {
      this.#direction = WALKER_DIRECTION_EAST;
    }
    if (angleDeg > 90 && angleDeg < 135) {
      this.#direction = WALKER_DIRECTION_SOUTH_EAST;
    }
    if (angleDeg > 135 && angleDeg < 180) {
      this.#direction = WALKER_DIRECTION_SOUTH;
    }
    console.info(angleDeg, this.#direction)
  }
}








