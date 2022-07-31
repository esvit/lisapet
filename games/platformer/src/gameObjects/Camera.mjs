export default
class Camera {
  #focalPoint = [0, 0];

  #cameraCenter = [0, 0];

  #size = [100, 100];

  #followObject = null;

  constructor(focalX, focalY) {
    if (focalX || focalY) {
      this.#focalPoint = [focalX, focalY];
    }
  }

  get focalPoint() {
    return this.#focalPoint;
  }

  set focalPoint([x, y]) {
    this.#focalPoint = [x, y];
  }

  get cameraCenter() {
    return this.#cameraCenter;
  }

  set cameraCenter([x, y]) {
    this.#cameraCenter = [x, y];
  }

  get size() {
    return this.#size;
  }

  set size([w, h]) {
    this.#size = [w, h];
  }

  get box() {
    const [x, y] = this.#followObject ? [this.#followObject.x, this.#followObject.y] : this.#focalPoint;
    const [cx, cy] = this.#cameraCenter;
    const [w, h] = this.#size;

    const left = x - (w - cx);
    const top = y - (h - cy);

    return [left, top, w, h];
  }

  follow(gameObject) {
    this.#followObject = gameObject;
  }
}
