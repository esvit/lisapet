import BaseBuilding from './BaseBuilding.mjs';
import ImmigrantWalker from '../Walkers/ImmigrantWalker.mjs';

const CHECK_TO_ROAD_EXISTS = 10;

export default 
class House extends BaseBuilding {
  #immigrand = null;
  
  #level = 0;
  
  #road = null;

  #waitFor = 0;
  
  #checksOfRoadExists = 0;
  
  constructor(map, x, y) {
    super(map, x, y);

    this.runImmigrand();
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
    this.#immigrand = this.map.addFigure(new ImmigrantWalker(this.map, entryX, entryY));
  
    const { mapX: x, mapY: y } = this.#road;

    const { random } = this.map.get(x, y);
    const ticks = 10 + (random & 0x7f);
    this.#immigrand.waitFor(ticks);
    this.#immigrand.move([x, y]);
    this.#immigrand.on('done', () => {
      this.map.state.removeFigure(this.#immigrand);
      this.#level = 1;
    });
  }
  
  draw(layer, tile) {
    const { random } = tile;
    switch (this.#level) {
    case 0:
      layer.drawTileSprite(tile, ['housng1a', 45]);
      break;
    case 1:
      layer.drawTileSprite(tile, ['housng1a', random % 2 === 0 ? 1 : 2]);
      break;
    }
  }
  
  tick() {
    super.tick();
    
    if (this.#waitFor > 0) {
      this.#waitFor--;
      return;
    }
    if (!this.#immigrand && this.#level === 0) {
      this.runImmigrand();
    }
  }
}
