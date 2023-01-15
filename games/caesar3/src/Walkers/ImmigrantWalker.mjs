import Walker from './Walker.mjs';
import ImmigrantCart from './ImmigrantCart.mjs';
import { WALKER_IMMIGRANT } from '../constants.mjs';

export default
class ImmigrantWalker extends Walker {
  constructor(id, map) {
    super(id, map);

    this.cart = new ImmigrantCart(map);
  }

  get spriteNumber() {
    return WALKER_IMMIGRANT;
  }
}
