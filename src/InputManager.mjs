import EventEmitter from './EventEmitter.mjs';

export default
class InputManager extends EventEmitter {
  #state = {};

  constructor({ canvas }) {
    super();

    this.canvas = canvas;

    canvas.addEventListener('click', (e) => {
      this.emit('click', { x: e.offsetX, y: e.offsetY });
    });
    canvas.addEventListener('mousemove', (e) => {
      this.emit('move', { x: e.offsetX, y: e.offsetY });
    });
    canvas.addEventListener('mouseout', (e) => {
      this.emit('mouseout', { x: e.offsetX, y: e.offsetY });
    });
    canvas.addEventListener('keydown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.#state[e.code]) {
        this.#state[e.code] = true;
        this.emit('changeState', this.#state);
      }
    });
    canvas.addEventListener('keyup', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.#state[e.code]) {
        this.#state[e.code] = false;
        this.emit('changeState', this.#state);
      }
    });
  }
}
