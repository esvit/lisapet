import ResourceManager from "../ResourceManager.mjs";

export default
class Atlas {
  constructor({ ResourceManager }, atlasFile) {
    this.resourceManager = ResourceManager;
    this.atlasFile = atlasFile;
  }

  get sprites() {
    return Object.values(this.options).map((char) => char.sprite);
  }

  async load() {
    const [json] = await this.resourceManager.loadBatch([this.atlasFile]);
    const sprites = Object.values(json).map((char) => char.sprite);
    const images = await this.resourceManager.loadBatch(sprites);

    const characters = Object.entries(json);
    this.characters = Object.fromEntries(characters.map(([name, obj]) => ([name, { ...obj, sprite: images[sprites.findIndex((i) => i === obj.sprite)] }])));
  }

  drawSprite(ctx, characterName, animationName, frame, x, y, swap = false, centered = false) {
    const character = this.characters[characterName];
    if (!character) {
      throw new Error(`Character "${characterName}" not found`);
    }
    const animation = character.animations[animationName];
    if (!animation) {
      throw new Error(`Animation "${animationName}" not found`);
    }

    const frameIndex = animation[frame];
    const [fx, fy, fw, fh] = character.frames[frameIndex];
    const [drawX, drawY, drawW, drawH] = [x, y, fw * 2, fh * 2];
    let modX = 1;

    ctx.save();
    if (swap) {
      modX = -1;
    }
    ctx.scale(modX, 1);
    ctx.drawImage(character.sprite, fx, fy, fw, fh, drawX * modX - (drawW / 2), drawY - drawH, drawW, drawH);
    // ctx.fillStyle = 'red';
    // ctx.fillRect(x, y, 3, 3);
    ctx.restore();
  }
}
