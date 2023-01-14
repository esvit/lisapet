export default
class BaseBuilding {
  restore(stream) {
    this.subtypeHouseLevel = stream.readShort(); // which union field we use does not matter
    this.roadNetworkId = stream.readByte();
    this.monthlyLevy = stream.readByte();
    this.createdSequence = stream.readShort();
    this.housesCovered = stream.readShort();
    this.percentageHousesCovered = stream.readShort();
    this.housePopulation = stream.readShort();
    this.housePopulationRoom = stream.readShort();
    this.distanceFromEntry = stream.readShort();
    this.houseHighestPopulation = stream.readShort();
    this.houseUnreachableTicks = stream.readShort();
    this.roadAccess = { x: stream.readByte(), y: stream.readByte() };
    this.figureId = stream.readShort();
    this.figureId2 = stream.readShort();
    this.immigrantFigureId = stream.readShort();
    this.figureId4 = stream.readShort();
    this.figure_spawn_delay = stream.readByte();
    this.days_since_offering = stream.readByte();
    this.figure_roam_direction = stream.readByte();
    this.has_water_access = stream.readByte();
    this.house_tavern_wine_access = stream.readByte();
    this.house_tavern_meat_access = stream.readByte();
    this.prev_part_building_id = stream.readShort();
    this.next_part_building_id = stream.readShort();
    this.loads_stored = stream.readShort();
    this.house_sentiment_message = stream.readByte();
    this.has_well_access = stream.readByte();
    this.num_workers = stream.readShort();
    this.labor_category = stream.readByte();
    this.outputResourceId = stream.readByte();
    this.has_road_access = stream.readByte();
    this.house_criminal_active = stream.readByte();
    this.damage_risk = stream.readShort();
    this.fire_risk = stream.readShort();
    this.fire_duration = stream.readShort();
    this.fire_proof = stream.readByte();
    this.house_figure_generation_delay = stream.readByte();
    this.house_tax_coverage = stream.readByte();
    this.house_pantheon_access = stream.readByte();
    this.formation_id = stream.readShort();
    this.restoreByType(stream);
    this.tax_income_or_storage = stream.readInt();
    this.house_days_without_food = stream.readByte();
    this.has_plague = stream.readByte();
    this.desirability = stream.readByte();
    this.is_deleted = stream.readByte();
    this.is_adjacent_to_water = stream.readByte();
    this.storageId = stream.readByte();
    this.sentimentHouseHappiness = stream.readByte(); // which union field we use does not matter
    this.show_on_problem_overlay = stream.readByte();
  }
  
  restoreByType(stream) {
    for (let i = 0; i < 26; i++) {
      stream.readByte();
    }
    this.entertainment = {};
    this.entertainment.numShows = stream.readByte();
    this.entertainment.days1 = stream.readByte();
    this.entertainment.days2 = stream.readByte();
    this.entertainment.play = stream.readByte();
    for (let i = 0; i < 12; i++) {
      stream.readByte();
    }
  }
}
