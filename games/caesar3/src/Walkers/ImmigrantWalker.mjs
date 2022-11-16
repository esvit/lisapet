import Walker from './Walker.mjs';
import ImmigrantCart from './ImmigrantCart.mjs';

export default
class ImmigrantWalker extends Walker {
  constructor({ di, map }) {
    super({ di, map });

    this.cart = new ImmigrantCart({ di });
  }
}
