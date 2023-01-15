import Walker from './Walker.mjs';
import {
  WALKER_ENGINEER,
  WALKER_IMMIGRANT,
  WALKER_PLAIN_CITIZEN,
  WALKER_TAXER
} from '../constants.mjs';
import {
  FIGURE_ENGINEER,
  FIGURE_LABOR_SEEKER,
  FIGURE_PREFECT,
  FIGURE_TAX_COLLECTOR,
  FIGURE_WAREHOUSEMAN,
} from '../constants/figures.mjs';

export default
class PlainWalker extends Walker {
  get spriteNumber() {
    switch (this.type) {
    case FIGURE_TAX_COLLECTOR: return WALKER_TAXER;
    case FIGURE_LABOR_SEEKER: return WALKER_PLAIN_CITIZEN;
    case FIGURE_ENGINEER: return WALKER_ENGINEER;
    case FIGURE_WAREHOUSEMAN: return WALKER_PLAIN_CITIZEN;
    case FIGURE_PREFECT: return WALKER_PLAIN_CITIZEN;
    }
    return WALKER_IMMIGRANT;
  }
}
