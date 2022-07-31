import Scene from '../../../../src/Scene.mjs';
import Camera from '../gameObjects/Camera.mjs';
import Player from '../gameObjects/Player.mjs';
import PhysicsWorld from '../physics/PhysicsWorld.mjs';
import RayCaster from '../physics/RayCaster.mjs';
import Gravity from '../physics/Gravity.mjs';
import Moving from '../physics/Moving.mjs';

const LEVEL_MASK = 'levels/mask.png';

const MASK_WIDTH = 10368;
const MASK_HEIGHT = 1712;

const PLAYER_WIDTH = 48;
const PLAYER_HEIGHT = 48;
const BOTTOM_PLAYER_POSITION = 256;

export default
class GameScene extends Scene {
  playerX = 0;
  playerY = 0;

  inputState = {};
  camera = null;
  moving = null;

  constructor({ DrawingContext, ResourceManager, InputManager, GameState, SceneManager }) {
    super();

    this.sceneManager = SceneManager;
    this.drawingContext = DrawingContext;
    this.resourceManager = ResourceManager;
    this.inputManager = InputManager;
    this.gameState = GameState;
  }

  async loading() {
    await this.resourceManager.loadBatch([
      LEVEL_MASK
    ]);

    this.playerX = 2900;
    this.playerY = 1000;

    this.player = new Player([this.playerX, this.playerY, PLAYER_WIDTH, PLAYER_HEIGHT]);
    this.camera = new Camera();
    this.camera.follow(this.player);
    this.drawingContext.camera = this.camera;

    this.physicsWorld = new PhysicsWorld({ width: MASK_WIDTH, height: MASK_HEIGHT });
    this.physicsWorld.addObject(this.player);

    this.player.addProcessor(new RayCaster({
      maskImage: this.resourceManager.get(LEVEL_MASK),
      distance: 26
    }));

    this.moving = new Moving(this.inputState);
    this.player.addAffector(this.moving);
    this.player.addAffector(new Gravity());

    this.resume();

    setTimeout(() => this.physicsWorld.update(), 1000);
  }

  pause() {
    this.inputManager.off('changeState');
  }

  resume() {
    this.inputManager.on('changeState', this.changeState.bind(this));
  }

  draw() {
    this.camera.size = [this.drawingContext.width, this.drawingContext.height];
    this.camera.cameraCenter = [this.drawingContext.width / 2, BOTTOM_PLAYER_POSITION];

    const [cx, cy, cw, ch] = this.camera.box;
    this.drawingContext.drawSprite(this.resourceManager.get(LEVEL_MASK), cx, cy, cw, ch, 0, 0, this.drawingContext.width, this.drawingContext.height);

    // this.drawingContext.drawRect(this.player.x - cx, this.player.y - cy, PLAYER_WIDTH, PLAYER_HEIGHT, 'red');

    this.physicsWorld.update();
    this.physicsWorld.drawDebug(this.drawingContext);
  }

  changeState(state) {
    this.inputState = state;
    this.moving.inputState = state;
  }
}
