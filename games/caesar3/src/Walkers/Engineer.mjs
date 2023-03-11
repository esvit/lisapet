import Figure from './Figure.mjs';
import { WALKER_ENGINEER } from '../constants.mjs';

export default
class Engineer extends Figure {
  get spriteNumber() {
    return WALKER_ENGINEER;
  }
}
