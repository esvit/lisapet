import Figure from './Figure.mjs';
import ImmigrantCart from './ImmigrantCart.mjs';
import { WALKER_IMMIGRANT } from '../constants.mjs';

export default
class ImmigrantWalker extends Figure {
  constructor(map, x, y) {
    super(map, x, y);

    this.cart = new ImmigrantCart(map);
  }

  get spriteNumber() {
    return WALKER_IMMIGRANT;
  }
}
