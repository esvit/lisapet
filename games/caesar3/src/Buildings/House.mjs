import BaseBuilding from './BaseBuilding.mjs';
import ImmigrantWalker from '../Walkers/ImmigrantWalker.mjs';

export default 
class House extends BaseBuilding {
  #immigrand = null;
  
  #level = 0;
  
  #road = null;
  
  constructor(map, x, y) {
    super(map, x, y);
    
    this.#road = this.detectRoad(2);
    if (!this.#road) {
      return;
    }
    this.runImmigrand();
  }
  
  runImmigrand() {
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
}
