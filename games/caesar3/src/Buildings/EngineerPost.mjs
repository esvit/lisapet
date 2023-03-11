import BaseBuilding from './BaseBuilding.mjs';
import Engineer from '../Walkers/Engineer.mjs';
import { getTileByBuildingId } from '../helpers/buildingTileId.mjs';
import { BUILDING_ENGINEERS_POST } from '../constants.mjs';

const CHECK_TO_ROAD_EXISTS = 10;

export default 
class EngineerPost extends BaseBuilding {
  #worker = null;

  #road = null;

  #waitFor = 0;
  
  #checksOfRoadExists = 0;
  
  constructor(map, x, y) {
    super(map, x, y);
  }

  runImmigrand() {
    this.#road = this.detectRoad(2);
    if (!this.#road) {
      if (this.#checksOfRoadExists++ > CHECK_TO_ROAD_EXISTS) {
        return this.delete();
      }
      this.#waitFor = 100;
      return;
    }
    const { x: entryX, y: entryY } = this.map.entryPoint;
    this.#worker = this.map.addFigure(new Engineer(this.map, entryX, entryY));
  
    const { mapX: x, mapY: y } = this.#road;

    const { random } = this.map.get(x, y);
    const ticks = 10 + (random & 0x7f);
    this.#worker.waitFor(ticks);
    this.#worker.move([x, y]);
    this.#worker.on('done', () => {
      this.map.state.removeFigure(this.#worker);
    });
  }
  
  draw(layer, tile) {
    layer.drawTileSprite(tile, getTileByBuildingId(BUILDING_ENGINEERS_POST));
    if (this.#worker) {
      layer.drawTileSpriteOnTop(tile, ['transport', 57 + (window.tick % 10)], [10, -5]);
    }
  }
  
  tick() {
    super.tick();
    
    if (this.#waitFor > 0) {
      this.#waitFor--;
      return;
    }
    if (!this.#worker) {
      this.runImmigrand();
    }
  }
}
