import { TERRAIN_ROAD } from '../constants.mjs';
import EventEmitter from '../../../../src/EventEmitter.mjs';

export default 
class BaseBuilding extends EventEmitter {
  #map = null;
  
  #x = null;

  #y = null;
  
  constructor(map, x, y) {
    super();

    this.#map = map;
    this.#x = x;
    this.#y = y;
  }
  
  get x() {
    return this.#x;
  }
  
  get y() {
    return this.#y;
  }
  
  get map() {
    return this.#map;
  }
  
  draw() {
    
  }
  
  tick() {
    
  }
  
  detectRoad(allowedDistance = 1) {
    let startX = this.#x - allowedDistance;
    let startY = this.#y - allowedDistance;
    let endX = this.#x + allowedDistance;
    let endY = this.#y + allowedDistance;
    if (startX < 0) {
      startX = 0;
    }
    if (startY < 0) {
      startY = 0;
    }
    if (endX > this.#map.mapSize[0]) {
      endX = this.#map.mapSize[0];
    }
    if (endY > this.#map.mapSize[1]) {
      endY = this.#map.mapSize[1];
    }
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const cell = this.#map.get(x, y);
        if (cell.terrain & TERRAIN_ROAD) {
          return cell;
        }
      }
    }
    return null;
  }

  delete() {
    this.emit('delete');
  }
}
