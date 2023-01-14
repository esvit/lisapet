import {
  MAX_INVASIONS,
  MAX_REQUESTS,
  MAX_HERD_POINTS,
  MAX_DEMAND_CHANGES,
  MAX_PRICE_CHANGES,
  MAX_FISH_POINTS,
  MAX_ALLOWED_BUILDINGS,
  MAX_INVASION_POINTS
} from '../constants.mjs';

export default
class Scenario {
  empireId = null;

  startYear = 0;

  requests = [];

  invasions = [];

  herdPoints = [];

  demandChanges = [];

  priceChanges = [];

  fishingPoints = [];

  allowedBuildings = [];

  invasionPoints = [];

  startingFunds = 0;

  enemyNationality = 0;

  river = {
    entry: { x: 0, y: 0 },
    exit: { x: 0, y: 0 },
  };

  empire = { isExpanded: 0, expansionYear: 0, distantBattleRomanTravelMonths: 0, distantBattleEnemyTravelMonths: 0 };

  nativeImages = { hut: 0, meeting: 0, crops: 0 };

  settings = { campaignMission: 0, startingFavor: 0, startingPersonalSavings: 0, campaignRank: 0, isCustom: 0 };
  
  constructor() {
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i] = {};
    }
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i] = {};
    }
    for (let i = 0; i < MAX_HERD_POINTS; i++) {
      this.herdPoints[i] = {};
    }
    for (let i = 0; i < MAX_DEMAND_CHANGES; i++) {
      this.demandChanges[i] = {};
    }
    for (let i = 0; i < MAX_PRICE_CHANGES; i++) {
      this.priceChanges[i] = {};
    }
    for (let i = 0; i < MAX_FISH_POINTS; i++) {
      this.fishingPoints[i] = {};
    }
    for (let i = 0; i < MAX_ALLOWED_BUILDINGS; i++) {
      this.allowedBuildings[i] = {};
    }
    for (let i = 0; i < MAX_INVASION_POINTS; i++) {
      this.invasionPoints[i] = {};
    }
  }

  restore(stream) {
    this.startYear = stream.readShort(); // Starting date, negative for BC
    stream.readByte(2); // skip, unknown
    this.empireId = stream.readShort(); // Empire location, 00 = Lugdunum, etc
    stream.readByte(8); // skip, unknown

    // requests
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].year = stream.readShort();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].resource = stream.readShort();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].amount = stream.readShort();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].deadlineYear = stream.readShort();
    }

    // invasions
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i].year = stream.readShort();
    }
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i].type = stream.readShort();
    }
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i].amount = stream.readShort();
    }
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i].from = stream.readShort();
    }
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i].attackType = stream.readShort();
    }
    stream.readShort(); // skip, unknown
    this.startingFunds = stream.readInt();
    this.enemyNationality = stream.readShort();
    stream.readByte(6); // skip, unknown

    this.mapWidth = stream.readInt();
    this.mapHeight = stream.readInt();
    this.startOffset = stream.readInt();
    this.borderSize = stream.readInt(); // MAP_SIZE_AND_BORDER - map.mapWidth

    this.name = stream.readChar(64);
    this.briefing = stream.readChar(522);

    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].canComplyDialogShown = stream.readByte();
    }
    
    this.imageId = stream.readShort();
    this.isOpenPlay = stream.readShort();
    this.playerRank = stream.readShort();

    for (let i = 0; i < MAX_HERD_POINTS; i++) {
      this.herdPoints[i].x = stream.readShort();
    }
    for (let i = 0; i < MAX_HERD_POINTS; i++) {
      this.herdPoints[i].y = stream.readShort();
    }

    for (let i = 0; i < MAX_DEMAND_CHANGES; i++) {
      this.demandChanges[i].year = stream.readShort();
    }
    for (let i = 0; i < MAX_DEMAND_CHANGES; i++) {
      this.demandChanges[i].month = stream.readByte();
    }
    for (let i = 0; i < MAX_DEMAND_CHANGES; i++) {
      this.demandChanges[i].resource = stream.readByte();
    }
    for (let i = 0; i < MAX_DEMAND_CHANGES; i++) {
      this.demandChanges[i].routeId = stream.readByte();
    }
    for (let i = 0; i < MAX_DEMAND_CHANGES; i++) {
      this.demandChanges[i].isRise = stream.readByte();
    }

    for (let i = 0; i < MAX_PRICE_CHANGES; i++) {
      this.priceChanges[i].year = stream.readShort();
    }
    for (let i = 0; i < MAX_PRICE_CHANGES; i++) {
      this.priceChanges[i].month = stream.readByte();
    }
    for (let i = 0; i < MAX_PRICE_CHANGES; i++) {
      this.priceChanges[i].resource = stream.readByte();
    }
    for (let i = 0; i < MAX_PRICE_CHANGES; i++) {
      this.priceChanges[i].amount = stream.readByte();
    }
    for (let i = 0; i < MAX_PRICE_CHANGES; i++) {
      this.priceChanges[i].is_rise = stream.readByte();
    }

    this.gladiatorRevolt = {
      enabled: stream.readInt(),
      year: stream.readInt(),
    };
    this.emperorChange = {
      enabled: stream.readInt(),
      year: stream.readInt(),
    };
    this.randomEvents = {
      seaTradeProblem: stream.readInt(),
      landTradeProblem: stream.readInt(),
      raiseWages: stream.readInt(),
      lowerWages: stream.readInt(),
      contaminatedWater: stream.readInt(),
      ironMineCollapse: stream.readInt(),
      clayPitFlooded: stream.readInt(),
    };

    for (let i = 0; i < MAX_FISH_POINTS; i++) {
      this.fishingPoints[i].x = stream.readShort();
    }
    for (let i = 0; i < MAX_FISH_POINTS; i++) {
      this.fishingPoints[i].y = stream.readShort();
    }

    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].favor = stream.readByte();
    }
    for (let i = 0; i < MAX_INVASIONS; i++) {
      this.invasions[i].month = stream.readByte();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].month = stream.readByte();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].state = stream.readByte();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].visible = stream.readByte();
    }
    for (let i = 0; i < MAX_REQUESTS; i++) {
      this.requests[i].monthsToComply = stream.readByte();
    }
    
    this.romeSuppliesWheat = stream.readInt();

    for (let i = 0; i < MAX_ALLOWED_BUILDINGS; i++) {
      this.allowedBuildings[i] = stream.readShort();
    }

    // win criteria
    this.winCriteria = {
      culture: { goal: stream.readInt() },
      prosperity: { goal: stream.readInt() },
      peace: { goal: stream.readInt() },
      favor: { goal: stream.readInt() },
      timeLimit: {},
      survivalTime: {},
      population: {},
    };

    this.winCriteria.culture.enabled = stream.readByte();
    this.winCriteria.prosperity.enabled = stream.readByte();
    this.winCriteria.peace.enabled = stream.readByte();
    this.winCriteria.favor.enabled = stream.readByte();
    this.winCriteria.timeLimit.enabled = stream.readInt();
    this.winCriteria.timeLimit.years = stream.readInt();
    this.winCriteria.survivalTime.enabled = stream.readInt();
    this.winCriteria.survivalTime.years = stream.readInt();

    this.earthquake = {};
    this.earthquake.severity = stream.readInt();
    this.earthquake.year = stream.readInt();

    this.winCriteria.population.enabled = stream.readInt();
    this.winCriteria.population.goal = stream.readInt();

    // map points
    this.earthquake.x = stream.readShort();
    this.earthquake.y = stream.readShort();
    this.entryPoint = { x: stream.readShort(), y: stream.readShort() };
    this.exitPoint = { x: stream.readShort(), y: stream.readShort() };

    for (let i = 0; i < MAX_INVASION_POINTS; i++) {
      this.invasionPoints[i].x = stream.readShort();
    }
    for (let i = 0; i < MAX_INVASION_POINTS; i++) {
      this.invasionPoints[i].y = stream.readShort();
    }

    this.river.entry.x = stream.readShort();
    this.river.entry.y = stream.readShort();
    this.river.exit.x = stream.readShort();
    this.river.exit.y = stream.readShort();

    this.rescueLoan = stream.readInt();
    this.winCriteria.milestone25Year = stream.readInt();
    this.winCriteria.milestone50Year = stream.readInt();
    this.winCriteria.milestone75Year = stream.readInt();

    this.nativeImages.hut = stream.readInt();
    this.nativeImages.meeting = stream.readInt();
    this.nativeImages.crops = stream.readInt();

    this.climate = stream.readByte();
    this.flotsamEnabled = stream.readByte();

    stream.readByte(2); // skip

    this.empire.isExpanded = stream.readInt();
    this.empire.expansionYear = stream.readInt();

    this.empire.distantBattleRomanTravelMonths = stream.readByte();
    this.empire.distantBattleEnemyTravelMonths = stream.readByte();
    this.openPlayScenarioId = stream.readByte();
    
    stream.readByte(1); // skip

    this.maxGameYear = stream.readInt();
    this.earthquake.gameYear = stream.readInt();
    this.earthquake.month = stream.readInt();
    this.earthquake.state = stream.readInt();
    this.earthquake.duration = stream.readInt();
    this.earthquake.maxDuration = stream.readInt();
    this.earthquake.maxDelay = stream.readInt();
    this.earthquake.delay = stream.readInt();
    this.earthquake.expand = stream.readByte(32);
    this.emperorChangeState = stream.readInt();
  }

  restoreSettings(stream) {
    // this.settings.campaignMission = stream.readInt();

    this.settings.startingFavor = stream.readInt();
    this.settings.startingPersonalSavings = stream.readInt();
    this.settings.campaignRank = stream.readInt();

    // this.settings.isCustom = stream.readInt();

    // buffer_skip(player_name, MAX_PLAYER_NAME);
    // buffer_read_raw(player_name, scenario.settings.player_name, MAX_PLAYER_NAME);
    // buffer_read_raw(scenario_name, scenario.scenario_name, MAX_SCENARIO_NAME);
  }
}
