import EventEmitter from './EventEmitter.mjs';

const FPS_UPDATE_TIME = 1;

export default
class DrawingContext extends EventEmitter {
  #camera = null;

  constructor({ canvas }) {
    super();

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.timeMeasurements = [];
    this.fps = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('orientationchange', this.#onResize.bind(this));
    window.addEventListener('resize', this.#onResize.bind(this));
  }

  #onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get cameraBox() {
    return this.#camera ? this.#camera.box : [0, 0, 0, 0];
  }

  get camera() {
    return this.#camera;
  }

  set camera(val) {
    this.#camera = val;
  }

  drawFps() {
    const msPassed = this.timeMeasurements[this.timeMeasurements.length - 1] - this.timeMeasurements[0];

    if (msPassed >= FPS_UPDATE_TIME * 1000) {
      this.fps = Math.round(this.timeMeasurements.length / msPassed * 1000);
      this.timeMeasurements = [];
    }

    this.ctx.fillStyle = '#fff';
    this.ctx.font      = 'normal 16pt Arial';
    this.ctx.fillText(`FPS: ${this.fps}`, 10, 26);
    if (typeof performance !== 'undefined' && typeof performance.memory !== 'undefined') {
      this.ctx.fillText(`Memory: ${Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100}Mb`, 10, 50);
    }
  }

  loop() {
    const drawCallback = () => {
      this.timeMeasurements.push(performance.now());

      this.clear();
      this.emit('draw');
      if (window.DEBUG) {
        this.drawFps();
      }
      requestAnimationFrame(drawCallback);
    }
    drawCallback();
  }

  clear(color = '#fff') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  lines(lines, strokeStyle = 'red', angle = 0) {
    const [cx, cy] = this.cameraBox;

    this.ctx.save();
    this.ctx.translate(-cx, -cy);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.beginPath();
    for (const line of lines) {
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawImage(image, x, y, width, height) {
    try {
      this.ctx.drawImage(image, x, y, width, height);
    } catch (err) {
    }
  }

  drawSprite(image, x, y, width, height, destX, destY, destWidth, destHeight) {
    try {
      this.ctx.drawImage(image, x, y, width, height, destX, destY, destWidth, destHeight);
    } catch (err) {
      // console.info(err, x, y, width, height, destX, destY, destWidth, destHeight)
    }
  }

  drawText(text, x, y, { align, color, size } = {}) {
    this.ctx.save();
    this.ctx.fillStyle = color || '#000';
    this.ctx.font = `${size || 20}px "Press Start 2P"`;
    this.ctx.textAlign = align || 'left';
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }
}
