import Scene from '../../../../../src/Scene.mjs';
import { CELL_EMPTY, CELL_O, CELL_X } from '../../shared/constants.mjs';

const CELL_SIZE = 150;

const ASSET_IMAGE_X = 'images/x.png';
const ASSET_IMAGE_O = 'images/o.png';

const ASSET_SOUND_X = 'sounds/assets_x.mp3';
const ASSET_SOUND_O = 'sounds/assets_o.mp3';

const SERVER_URL = 'http://localhost:8080';

export default
class GameScene extends Scene {
  constructor({ DrawingContext, ResourceManager, InputManager, GameState, SceneManager }) {
    super();

    this.sceneManager = SceneManager;
    this.drawingContext = DrawingContext;
    this.resourceManager = ResourceManager;
    this.inputManager = InputManager;
    this.gameState = GameState;
  }

  async loading() {
    this.userId = localStorage.getItem('userId') || `user${Math.random()}`;
    localStorage.setItem('userId', this.userId);

    const [soundX, soundO] = await this.resourceManager.loadBatch([
      ASSET_SOUND_X,
      ASSET_SOUND_O,
      ASSET_IMAGE_X,
      ASSET_IMAGE_O
    ]);
    this.audios = {
      [CELL_X]: soundX,
      [CELL_O]: soundO,
    };
    this.gameState.on('turn', (side) => {
      this.audios[side].play()
    });
    this.resume();
  }

  pause() {
    this.inputManager.off('click');
  }

  resume() {
    this.inputManager.on('click', this.click.bind(this));
  }

  start({ withAI } = { withAI: true }) {
    this.gameState.connectToServer(SERVER_URL, this.userId, withAI);
  }

  draw() {
    const CELL_PADDING = 30;

    const { map, wonSide, turnKey } = this.gameState;

    this.drawingContext.lines([
      { x1: CELL_SIZE, y1: 0, x2: CELL_SIZE, y2: CELL_SIZE * 3 },
      { x1: CELL_SIZE * 2, y1: 0, x2: CELL_SIZE * 2, y2: CELL_SIZE * 3 },
      { x1: 0, y1: CELL_SIZE, x2: CELL_SIZE * 3, y2: CELL_SIZE },
      { x1: 0, y1: CELL_SIZE * 2, x2: CELL_SIZE * 3, y2: CELL_SIZE * 2 }
    ]);

    for (const rowIndex in map) {
      const row = map[rowIndex];
      for (const cellIndex in row) {
        const cell = row[cellIndex];
        if (cell === CELL_EMPTY) {
          continue;
        }
        if (cell === CELL_X) {
          this.drawingContext.drawImage(
            this.resourceManager.get(ASSET_IMAGE_X),
            cellIndex * CELL_SIZE + CELL_PADDING,
            rowIndex * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - CELL_PADDING * 2,
            CELL_SIZE - CELL_PADDING * 2
          );
        } else {
          this.drawingContext.drawImage(
            this.resourceManager.get(ASSET_IMAGE_O),
            cellIndex * CELL_SIZE + CELL_PADDING,
            rowIndex * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - CELL_PADDING * 2,
            CELL_SIZE - CELL_PADDING * 2
          );
        }
      }
    }

    if (wonSide) {
      let text = 'Нічия';
      switch (wonSide) {
        case CELL_X: text = 'Виграли Хрестики'; break;
        case CELL_O: text = 'Виграли Нулики'; break;
      }
      this.drawingContext.drawText(text, 0, CELL_SIZE * 3 + 20);
    } else {
      this.drawingContext.drawText((turnKey) ? 'Ваша черга ходу' : 'Чекайте на хід суперника', 0, CELL_SIZE * 3 + 20);
    }
  }

  click({ x, y }) {
    const cellIndex = Math.ceil(x / CELL_SIZE);
    const rowIndex = Math.ceil(y / CELL_SIZE);
    const { map, isActiveGame, turnKey, gameId } = this.gameState;
    if (!isActiveGame) {
      this.sceneManager.loadScene('MenuScene')
      return;
    }
    if (cellIndex > 3 || rowIndex > 3) {
      return;
    }
    const cellState = map[rowIndex - 1][cellIndex - 1];
    if (cellState !== CELL_EMPTY || !turnKey) {
      return;
    }
    fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify({
        row: rowIndex - 1,
        cell: cellIndex - 1,
        gameId,
        turnKey
      })
    });
  }
}
