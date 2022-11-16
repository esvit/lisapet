import { pad } from '../helpers/math.mjs';
import {
  WALKER_CART_FRONT,
  WALKER_DIRECTION_EAST,
  WALKER_DIRECTION_NORTH,
  WALKER_DIRECTION_NORTH_EAST, WALKER_DIRECTION_NORTH_WEST,
  WALKER_DIRECTION_SOUTH,
  WALKER_DIRECTION_SOUTH_EAST,
  WALKER_DIRECTION_SOUTH_WEST,
  WALKER_DIRECTION_WEST
} from '../constants.mjs';

export default
class Cart {
  #di = null;

  #resourceManager = null;

  #walker = null;

  constructor({ di }) {
    this.#di = di;
    this.#resourceManager = di.get('ResourceManager');
  }

  get cartPosition() {
    return WALKER_CART_FRONT;
  }

  get walker() {
    return this.#walker;
  }

  set walker(val) {
    this.#walker = val;
  }

  draw(ctx) {
    const { x, y, direction } = this.#walker;
    const n = direction + 8 * 16; // 104
    const num = pad(n, 5);
    const [img, tileX, tileY, tileW, tileH] = this.#resourceManager.getByAtlas(`carts_${num}`);

    let offset = [0, 0];
    switch (direction) {
    case WALKER_DIRECTION_NORTH: offset = [-11, 6]; break;
    case WALKER_DIRECTION_NORTH_EAST: offset = [-20, -2]; break;
    case WALKER_DIRECTION_EAST: offset = [-15, -8]; break;
    case WALKER_DIRECTION_SOUTH_EAST: offset = [0, -10]; break;
    case WALKER_DIRECTION_SOUTH: offset = [10, -6]; break;
    case WALKER_DIRECTION_SOUTH_WEST: offset = [20, -2]; break;
    case WALKER_DIRECTION_WEST: offset = [11, 5]; break;
    case WALKER_DIRECTION_NORTH_WEST: offset = [0, 8]; break;
    }

    ctx.drawSprite(
      img,
      tileX, tileY, tileW, tileH,
      x + offset[0], y + offset[1], tileW, tileH
    );
  }
}
