import EventEmitter from './EventEmitter.mjs';

export const MOUSE_LEFT_BUTTON = 0;
export const MOUSE_MIDDLE_BUTTON = 1;
export const MOUSE_RIGHT_BUTTON = 2;

export default
class InputManager extends EventEmitter {
  #state = {};

  constructor({ canvas }) {
    super();

    this.canvas = canvas;

    canvas.addEventListener('contextmenu', (e) => {
      stop(e); // виключити контексне меню
    });
    canvas.addEventListener('click', (e) => {
      this.emit('click', buildEvent(e));
    });
    canvas.addEventListener('mousemove', (e) => {
      this.emit('move', buildEvent(e));
    });
    canvas.addEventListener('mousedown', (e) => {
      this.emit('mousedown', buildEvent(e));
    });
    canvas.addEventListener('mouseup', (e) => {
      this.emit('mouseup', buildEvent(e));
    });
    canvas.addEventListener('mouseout', (e) => {
      this.emit('mouseout', buildEvent(e));
    });
    canvas.addEventListener('keydown', (e) => {
      stop(e);
      if (!this.#state[e.code]) {
        this.#state[e.code] = true;
        this.emit('changeState', this.#state);
      }
    });
    canvas.addEventListener('keyup', (e) => {
      stop(e);
      if (this.#state[e.code]) {
        this.#state[e.code] = false;
        this.emit('changeState', this.#state);
      }
    });

    function buildEvent(e) {
      return {
        x: e.offsetX,
        y: e.offsetY,
        button: e.button,
        stop: () => stop(e)
      };
    }

    function stop(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
