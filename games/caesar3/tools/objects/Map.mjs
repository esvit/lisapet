import { GRID_SIZE } from '../constants.mjs';
import Scenario from './Scenario.mjs';
import Figures from './Figures.mjs';

export default
class Map {
  camera = { x: 0, y: 0 };

  tileId = []; // grid, 162x162

  edgeData = []; // grid, 162x162

  buildingIds = []; // grid, 162x162

  aqueductGrid = []; // grid, 162x162

  spriteGrid = []; // grid, 162x162

  randomNumbers = [];

  desirabilityGrid = [];

  elevationGrid = [];

  buildingDamageGrid = [];

  aqueductBackupGrid = [];

  spriteBackupGrid = [];

  scenario = null;

  // map size
  mapWidth = 0;
  mapHeight = 0;
  borderSize = 0;
  startOffset = 0;

  entryPoint = { x: 0, y: 0 };

  exitPoint = { x: 0, y: 0 };

  restoreLayers(stream, isSavedGame = false) {
    this.tileId = isSavedGame ? stream.readCompressedShorts() : stream.readShort(GRID_SIZE); // buildings, 162 x 162 x 2 bytes
    this.edgeData = isSavedGame ? stream.readCompressedBytes() : stream.readByte(GRID_SIZE); // edges, 162 x 162 x 1 bytes
    if (isSavedGame) {
      this.buildingIds = stream.readCompressedShorts(); // building IDs
    }
    this.terrainInfo = isSavedGame ? stream.readCompressedShorts() : stream.readShort(GRID_SIZE); // terrain types, 162 x 162 x 2 bytes
    if (isSavedGame) {
      this.aqueductGrid = stream.readCompressedBytes(); // акведук, одиниці
      this.heightInfo = stream.readCompressedBytes();
    }
    this.minimapInfo = isSavedGame ? stream.readCompressedBytes() : stream.readByte(GRID_SIZE);
    if (isSavedGame) {
      this.spriteGrid = stream.readCompressedBytes();
    }
    this.randomNumbers = stream.readByte(GRID_SIZE); // unknown (pseudo-random numbers seeds?)
    if (!isSavedGame) {
      this.heightInfo = stream.readByte(GRID_SIZE);
    }
    if (isSavedGame) {
      this.desirabilityGrid = stream.readCompressedBytes(); // бажаність
      this.elevationGrid = stream.readCompressedBytes(); // одні нулі
      this.buildingDamageGrid = stream.readCompressedBytes(); // акведук, одиниці
      this.aqueductBackupGrid = stream.readCompressedBytes(); // якісь показники, в ринку 10
      this.spriteBackupGrid = stream.readCompressedBytes();
    } else {
      stream.readByte(8); // unknown
      this.camera = {
        x: stream.readInt(),
        y: stream.readInt(),
      };
    }
  }

  restoreScenario(stream) {
    this.scenario = new Scenario();
    this.scenario.restore(stream);
  }

  restoreFigures(stream) {
    this.figures = new Figures();
    this.figures.restore(stream);
    this.figuresRoutes = stream.readCompressedShorts(); // figures ids, 1200 байт
    this.routePaths = stream.readCompressedBytes(); // directions, 600 x 500 bytes
    this.formations = stream.readCompressedBytes(); // unknown, 50 x 128 bytes
    this.formationLastInUse = stream.readInt();
    this.formationLastLegion = stream.readInt();
    this.formationLegionsTotals = stream.readInt();

    const elementsToLoad = this.routePaths.length / 500;

    for (let i = 0; i < elementsToLoad; i++) {
      const id = this.figuresRoutes[i];
      if (id === 0) {
        continue;
      }
      const figure = this.figures.getById(this.figuresRoutes[i]);
      figure.directions = this.routePaths.slice(i * 500, i * 500 + 500);
    }
  }
}
