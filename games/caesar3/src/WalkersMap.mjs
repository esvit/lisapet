import Map from './Map.mjs';
import { astar, Graph } from './helpers/astar.mjs';
import {TERRAIN_NONE, TERRAIN_ROAD} from './constants.mjs';
import ImmigrantWalker from './Walkers/ImmigrantWalker.mjs';

export default
class WalkersMap extends Map {
  #walkers = [];

  addWalker(walker, from, to) {
    this.#walkers.push(walker);
    walker.move(from, to);
  }

  addImmigrantWalker() {
    if (!this.data || !this.data.peopleEntryPoint) {
      return;
    }
    const [x, y, x2, y2] = this.data.peopleEntryPoint;

    const walker = new ImmigrantWalker({di: this.di, map: this});
    this.addWalker(walker, [x, y], [x2, y2]);
  }

  getPath(start, dest) {
    const areaForSearch = [];
    for (let x = 0; x < this.size; x++) {
      const row = [];
      for (let y = 0; y < this.size; y++) {
        const { terrain } = this.get(x, y);
        let score = 0;
        if (terrain & TERRAIN_NONE) {
          score = 1;
        }
        if (terrain & TERRAIN_ROAD) {
          score = 2;
        }
        row.push(score);
      }
      areaForSearch.push(row);
    }
    const graph = new Graph(areaForSearch);
    return astar.search(graph, graph.grid[start[0]][start[1]], graph.grid[dest[0]][dest[1]], { closest: false, diagonal: true });
  }

  draw(ctx) {
    for (const walker of this.#walkers) {
      walker.draw(ctx);
    }
  }

  tick() {
    for (const walker of this.#walkers) {
      walker.tick();
    }
  }
}
