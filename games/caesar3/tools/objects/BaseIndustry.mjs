import {
  BUILDING_POTTERY_WORKSHOP,
  BUILDING_WHARF,
  BUILDING_WHEAT_FARM
} from '../constants.mjs';
import BaseBuilding from './BaseBuilding.mjs';

export default
class BaseIndustry extends BaseBuilding {
  industry = {
    progress: 0
  };

  restoreByType(stream) {
    this.industry.progress = stream.readShort();
    stream.readInt();
    stream.readInt();
    stream.readShort();
    stream.readByte();
    this.industry.isStockpiling = stream.readByte();
    this.industry.hasFish = stream.readByte();
    stream.readInt();
    stream.readInt();
    stream.readInt();
    stream.readShort();
    this.industry.blessingDaysLeft = stream.readByte();
    this.industry.orientation = stream.readByte();
    this.industry.hasRawMaterials = stream.readByte();
    stream.readByte();
    this.industry.curse_days_left = stream.readByte();
    if ((this.type >= BUILDING_WHEAT_FARM && this.type <= BUILDING_POTTERY_WORKSHOP) || this.type === BUILDING_WHARF) {
      this.industry.ageMonths = stream.readByte();
      this.industry.averageProductionPerMonth = stream.readByte();
      this.industry.productionCurrentMonth = stream.readShort();
      stream.readShort();
    } else {
      stream.readInt();
      stream.readShort();
    }
    this.industry.fishingBoatId = stream.readShort();
  }
}
