import Cart from './Cart.mjs';
import {WALKER_CART_BEHIND, WALKER_CART_FRONT} from '../constants.mjs';

export default
class ImmigrantCart extends Cart {
  get cartPosition() {
    return WALKER_CART_BEHIND;
  }
}
