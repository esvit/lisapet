import { pad } from '../helpers/math.mjs';
import {
  WALKER_CART_BEHIND,
  WALKER_CART_FRONT
} from '../constants.mjs';

const CART_OFFSETS_X = [13, 18, 12, 0, -13, -18, -13, 0];
const CART_OFFSETS_Y = [-7, -1, 7, 11, 6, -1, -7, -12];

export default
class Cart {
  #walker = null;

  get cartSprite() {
    return 1;
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

  draw(layer, tile, [x, y]) {
    const { direction } = this.#walker;
    const n = (direction + 1) + 8 * this.cartSprite; // 104
    const num = pad(n, 5);

    let cartDirection = direction; // спереду людини
    if (this.cartPosition === WALKER_CART_BEHIND) {
      cartDirection = (direction + 4) % 8; // позаду
    }
    let offset = [
      CART_OFFSETS_X[cartDirection],
      CART_OFFSETS_Y[cartDirection],
    ];

    layer.drawTileSprite({ drawX: x + offset[0], drawY: y + offset[1], drawW: 58, drawH: 30 }, `carts_${num}`);
  }
}
