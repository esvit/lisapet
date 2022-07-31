import { rotatePointAroundPoint } from '../../../../src/helpers/math.mjs';

export const RAYS_4 = [
  (x, y, distance) => [x, y + distance],
  (x, y, distance) => [x + distance, y],
  (x, y, distance) => [x, y - distance],
  (x, y, distance) => [x - distance, y],
];
export const RAYS_8 = [
  ...RAYS_4,
  (x, y, distance) => [x + distance, y + distance],
  (x, y, distance) => [x + distance, y - distance],
  (x, y, distance) => [x - distance, y - distance],
  (x, y, distance) => [x - distance, y + distance],
];

export default
class RayCaster {
  #entity = null;

  #maskContext = null;

  #distance = null;

  #rayFunctions = [];

  constructor({ maskImage, rays, distance }) {
    const canvas = document.createElement('canvas');
    canvas.width = maskImage.width;
    canvas.height = maskImage.height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, maskImage.width, maskImage.height);
    context.drawImage(maskImage, 0, 0);

    this.#maskContext = context;
    this.#distance = distance || 100;

    this.#rayFunctions = rays || RAYS_8;
  }

  set entity(entity) {
    this.#entity = entity;
  }

  getCollisions() {
    const centerPoint = [this.#entity.midX, this.#entity.midY];
    const collisions = [];
    for (let s = 0; s < this.#distance; s++) {
      for (const rayIndex in this.#rayFunctions) {
        const ray = this.#rayFunctions[rayIndex];
        const end = ray(centerPoint[0], centerPoint[1], s);
        const point = rotatePointAroundPoint(centerPoint, end, this.#entity.angle);

        const color = this.#maskContext.getImageData(point[0], point[1], 1, 1).data;
        if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
          collisions.push([...point, rayIndex]);
        }
      }
    }
    return collisions;
  }

  drawDebug(ctx) {
    const centerPoint = [this.#entity.midX, this.#entity.midY];
    const collisions = this.getCollisions();
    for (const ray of this.#rayFunctions) {
      const end = ray(centerPoint[0], centerPoint[1], this.#distance);
      const point = rotatePointAroundPoint(centerPoint, end, this.#entity.angle);

      ctx.lines([
        { x1: centerPoint[0], y1: centerPoint[1], x2: point[0], y2: point[1] }
      ], 'gray');
    }
    for (const collision of collisions) {
      ctx.lines([
        { x1: collision[0], y1: collision[1], x2: collision[0] + 1, y2: collision[1] + 1 }
      ], 'red');
    }
  }
}
