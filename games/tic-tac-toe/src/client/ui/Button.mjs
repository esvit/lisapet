import Element from './Element.mjs';

export default
class UIButton extends Element {
  constructor({ text, click, ...params }) {
    super(params);

    this.text = text;
    this.click = click;
    this.state = 0;
  }

  draw(ctx) {
    super.draw(ctx);

    ctx.font = `normal 16px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (this.state) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#fff';
    } else {
      ctx.fillStyle = 'red';
    }
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }
}
