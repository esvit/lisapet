import { rotatePointAroundPoint } from '../../../../src/helpers/math.mjs';

const JUMP_HEIGHT = 10;
const MOVE_LENGTH = 10;

export default
class Moving {
  #entity = null;

  #inputState = null;

  constructor(inputState) {
    this.#inputState = inputState;
  }

  set entity(entity) {
    this.#entity = entity;
  }

  set inputState(state) {
    this.#inputState = state;
  }

  update() {
    const move = [0, 0];
    if (this.#inputState.KeyA || this.#inputState.ArrowLeft) {
      move[0] -= MOVE_LENGTH;
    }
    if (this.#inputState.KeyD || this.#inputState.ArrowRight) {
      move[0] += MOVE_LENGTH;
    }
    if (this.#inputState.KeyW || this.#inputState.ArrowUp) {
      move[1] -= JUMP_HEIGHT;
    }
    if (this.#inputState.KeyS || this.#inputState.ArrowDown) {
      // move[1] += JUMP_HEIGHT;
    }
    const point = rotatePointAroundPoint([0, 0], move, this.#entity.angle);

    this.#entity.x += point[0];
    this.#entity.y += point[1];

    for (const processor of this.#entity.getProcessors()) {
      let collisions = processor.getCollisions();

      for (const collision of collisions) {
        if (collision[2] === '4') {
          this.#entity.angle += 2;
          break;
        }
        if (collision[2] === '7') {
          this.#entity.angle -= 2;
          break;
        }
      }
    }
  }
}
