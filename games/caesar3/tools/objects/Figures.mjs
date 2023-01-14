import {
  MAX_FIGURES
} from '../constants.mjs';
import Figure from "./Figure.mjs";

export default
class Figures {
  #figures = [];

  getById(id) {
    for (const figure of this.#figures) {
      if (figure.id === id) {
        return figure;
      }
    }
    return null;
  }

  restore(stream) {
    this.#figures = [];
    const walkersStream = stream.getCompressedStream(); // walkers, 1000 x 128 bytes
    for (let i = 0; i < MAX_FIGURES; i++) {
      const alternativeLocationIndex = walkersStream.readByte();
      const imageOffset = walkersStream.readByte();
      const isEnemyImage = walkersStream.readByte();
      const flotsamVisible = walkersStream.readByte();
      const imageId = walkersStream.readShort();
      const cartImageId = walkersStream.readShort();
      const nextFigureIdOnSameTile = walkersStream.readShort();
      const type = walkersStream.readByte();
      const figure = new Figure();
      figure.id = i;
      figure.type = type;
      figure.nextFigureIdOnSameTile = nextFigureIdOnSameTile;
      figure.cartImageId = cartImageId;
      figure.imageId = imageId;
      figure.flotsamVisible = flotsamVisible;
      figure.isEnemyImage = isEnemyImage;
      figure.imageOffset = imageOffset;
      figure.alternativeLocationIndex = alternativeLocationIndex;
      figure.restore(walkersStream);
      if (figure.state) {
        this.#figures.push(figure);
      }
    }
  }
}
