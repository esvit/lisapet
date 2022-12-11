import Walker from './Walker.mjs';
import ImmigrantCart from './ImmigrantCart.mjs';
import { WALKER_IMMIGRANT } from '../constants.mjs';

export default
class ImmigrantWalker extends Walker {
  constructor({ di, map }) {
    super({ di, map });

    this.cart = new ImmigrantCart({ di });
  }

  get spriteNumber() {
    return WALKER_IMMIGRANT;
  }
}
