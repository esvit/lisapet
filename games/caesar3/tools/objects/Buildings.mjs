import {
  BUILDING_HOUSE_VACANT_LOT,
  BUILDING_HOUSE_LUXURY_PALACE,
  MAX_BUILDINGS,
  BUILDING_GRANARY,
  BUILDING_WHEAT_FARM,
  BUILDING_POTTERY_WORKSHOP,
} from '../constants.mjs';
import House from './House.mjs';
import Granary from "./Granary.mjs";
import BaseIndustry from './BaseIndustry.mjs';
import BaseBuilding from './BaseBuilding.mjs';

export default
class Buildings {
  buildings = [];
  
  restore(stream) {
    const buildingsStream = stream.getCompressedStream();
    for (let i = 0; i < MAX_BUILDINGS; i++) {
      const state = buildingsStream.readByte();
      const factionId = buildingsStream.readByte();
      buildingsStream.readByte(); // unknown
      const size = buildingsStream.readByte();
      const houseIsMerged = buildingsStream.readByte();
      const houseSize = buildingsStream.readByte();
      const x = buildingsStream.readByte();
      const y = buildingsStream.readByte();
      const gridOffset = buildingsStream.readShort();
      const type = buildingsStream.readShort();
      
      const building = this.createBuilding(type);
      building.id = i;
      building.state = state;
      building.x = x;
      building.y = y;
      building.size = size;
      building.houseSize = houseSize;
      building.houseIsMerged = houseIsMerged;
      building.type = type;
      building.restore(buildingsStream);
      if (building.state) {
        this.buildings.push(building);
      }
    }
  }
  
  createBuilding(type) {
    if (type >= BUILDING_HOUSE_VACANT_LOT && type <= BUILDING_HOUSE_LUXURY_PALACE) {
      return new House();
    }
    if (type >= BUILDING_WHEAT_FARM && type <= BUILDING_POTTERY_WORKSHOP) {
      return new BaseIndustry();
    }
    if (type === BUILDING_GRANARY) {
      return new Granary();
    }
    return new BaseBuilding();
  }
}
