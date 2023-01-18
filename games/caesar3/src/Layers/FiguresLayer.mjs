import AbstractLayer from './AbstractLayer.mjs';
import {pad} from "../helpers/math.mjs";

export default class FiguresLayer extends AbstractLayer {
  #figures = null;
  
  drawBeforeTiles() {
    // робимо об'єкт, щоб було зручніше доступатись до будівень по кординатам у drawTile
    this.#figures = {};
    for (const figure of this.map.state.figures) {
      this.#figures[figure.x] = this.#figures[figure.x] || {};
      this.#figures[figure.x][figure.y] = figure;
    }
  }
  
  drawTile(tile) {
    const { mapX, mapY } = tile;
    if (!this.#figures[mapX] || !this.#figures[mapX][mapY]) {
      return;
    }
    this.drawTileSprite(tile, `land1a_${pad(2, 533)}`);
    const figure = this.#figures[mapX][mapY];
    figure.draw(this, tile);
  }

  drawAfterTiles() {
    for (const figure of this.map.state.figures) {
      // figure.drawDebugPath(this);
    }
  }
}
