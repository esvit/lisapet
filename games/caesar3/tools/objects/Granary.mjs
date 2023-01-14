import {
  RESOURCE_MAX
} from '../constants.mjs';
import BaseBuilding from './BaseBuilding.mjs';

export default
class Granary extends BaseBuilding  {
  resourceStored = new Array(RESOURCE_MAX);

  spaceForUnits = null;

  restoreByType(stream) {
    stream.readShort();
    this.spaceForUnits = stream.readShort();
    for (let i = 0; i < RESOURCE_MAX; i++) {
      this.resourceStored[i] = stream.readShort();
    }
    stream.readShort();
    stream.readInt();
  }
}
