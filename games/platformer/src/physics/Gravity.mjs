const GRAVITY_LENGTH = 6;

export default
class Gravity {
  #entity = null;

  constructor() {
  }

  set entity(entity) {
    this.#entity = entity;
  }

  update() {
    this.#entity.y = this.#entity.y + GRAVITY_LENGTH;

    if (this.#entity.angle > 0) {
      this.#entity.angle -= 1;
    }
    if (this.#entity.angle < 0) {
      this.#entity.angle += 1;
    }
    for (const processor of this.#entity.getProcessors()) {
      let arr = processor.getCollisions();
      if (arr.length) {
        this.#entity.y -= arr.length / 2;
      }
    }
  }
}
