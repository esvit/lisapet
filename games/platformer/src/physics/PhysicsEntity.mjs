import { rotatePointAroundPoint } from '../../../../src/helpers/math.mjs';

// На кінематичні об'єкти не впливає гравітація. Використовується для платформ
export const PHYSICS_TYPE_KINEMATIC = 'kinematic';

// Динамічні сутності будуть повністю змінюватися і на них впливають усі аспекти фізичної системи
export const PHYSICS_TYPE_DYNAMIC = 'dynamic';

// Роздільна здатність переміщення лише перемістить об’єкт за межі простору іншого та обнулить швидкість у цьому напрямку
export const PHYSICS_COLLISION_DISPLACE = 'displace';

// Пружна роздільна здатність зміщує, а також відбиває об'єкт, що стикається, зменшуючи швидкість на його коефіцієнт відновлення
export const PHYSICS_COLLISION_ELASTIC = 'elastic';

const collisions = {
  [PHYSICS_COLLISION_DISPLACE]: (restitution) => this.restitution = restitution || .2,
  [PHYSICS_COLLISION_ELASTIC]: (restitution) => this.restitution = restitution
};

export default
class PhysicsEntity {
  #affectors = [];

  #processors = [];

  constructor({ x, y, width, height, collisionType, collisionDetector, ref, groups }) {
    this.ref = ref;
    this.groups = groups || [];

    // Position
    this.x = x;
    this.y = y;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Acceleration
    this.ax = 0;
    this.ay = 0;

    this.angle = 0;

    this.width = width;
    this.height = height;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.collisionType = collisions[collisionType || PHYSICS_COLLISION_DISPLACE];
    this.collisionDetector = collisionDetector;
  }

  getProcessors() {
    return this.#processors;
  }

  get midX() {
    return this.halfWidth + this.x;
  }

  get midY() {
    return this.halfHeight + this.y;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  isCollideRect({ left, top, right, bottom }) {
    return !(this.bottom - 1 < top + 1 || this.top + 1 > bottom - 1 || this.right - 1 < left + 1 || this.left + 1 > right - 1);
  }

  drawDebug(ctx) {
    const centerPoint = [this.midX, this.midY];
    const [x1, y1] = rotatePointAroundPoint(centerPoint, [this.left, this.top], this.angle);
    const [x2, y2] = rotatePointAroundPoint(centerPoint, [this.right, this.top], this.angle);
    const [x3, y3] = rotatePointAroundPoint(centerPoint, [this.right, this.bottom], this.angle);
    const [x4, y4] = rotatePointAroundPoint(centerPoint, [this.left, this.bottom], this.angle);
    ctx.lines([
      { x1, y1, x2, y2 },
      { x1: x2, y1: y2, x2: x3, y2: y3 },
      { x1: x3, y1: y3, x2: x4, y2: y4 },
      { x1: x4, y1: y4, x2: x1, y2: y1 }
    ], 'blue', this.angle);

    for (const processor of this.#processors) {
      processor.drawDebug(ctx);
    }
  }

  update() {
    for (const affector of this.#affectors) {
      const startX = this.x;
      const startY = this.y;
      affector.update();

      for (const processor of this.#processors) {
        const arr = processor.getCollisions();
        if (arr.length) {
          this.x = startX;
          this.y = startY;
        }
      }
    }
  }

  addAffector(affector) {
    affector.entity = this;
    this.#affectors.push(affector);
  }

  addProcessor(processor) {
    processor.entity = this;
    this.#processors.push(processor);
  }
}
