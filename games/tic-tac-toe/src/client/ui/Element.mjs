export default
class Element {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = 'green';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
