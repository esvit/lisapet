import Scene from '../../../../../src/Scene.mjs';
import UIButton from '../ui/Button.mjs';
import GameScene from './GameScene.mjs';

const ASSET_SOUND_CLICK = 'sounds/assets_click.mp3';

export default
class MenuScene extends Scene {
  elements = [];

  constructor({ di, canvas, SceneManager, ResourceManager, DrawingContext, InputManager }) {
    super();

    this.di = di;
    this.canvas = canvas;
    this.sceneManager = SceneManager;
    this.resourceManager = ResourceManager;
    this.drawingContext = DrawingContext;
    this.inputManager = InputManager;
  }

  pause() {
    this.inputManager.off('move');
    this.inputManager.off('click');
  }

  resume() {
    this.inputManager.on('move', this.move.bind(this));
    this.inputManager.on('click', this.click.bind(this));
  }

  move({ x, y }) {
    for (const element of this.elements) {
      if (x >= element.x && y >= element.y && x <= element.x + element.width && y <= element.y + element.height) {
        element.state = 1;
      } else {
        element.state = 0;
      }
    }
  }

  click({ x, y }) {
    for (const element of this.elements) {
      if (x >= element.x && y >= element.y && x <= element.x + element.width && y <= element.y + element.height) {
        element.click();
        return;
      }
    }
  }

  async loading() {
    const [clickSound] = await this.resourceManager.loadBatch([
      ASSET_SOUND_CLICK
    ]);

    this.elements = [
      new UIButton({
        x: 0,
        y: 50,
        width: 300,
        height: 50,
        text: 'Проти компʼютеру',
        click: () => {
          this.sceneManager.loadScene(GameScene, { withAI: true });
          clickSound.play();
        }
      }),
      new UIButton({
        x: 0,
        y: 150,
        width: 300,
        height: 50,
        text: 'Проти гравця',
        click: () => {
          this.sceneManager.loadScene(GameScene, { withAI: false });
          clickSound.play();
        }
      })
    ];

    this.resume();
  }

  draw() {
    const ctx = this.canvas.getContext('2d');

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    for (const element of this.elements) {
      element.draw(ctx);
    }
  }
}
