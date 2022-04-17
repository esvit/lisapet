import AIPlayer from './AIPlayer.mjs';
import { CELL_EMPTY, CELL_X, CELL_O, CELL_TIE } from '../shared/constants.mjs';
import GameState from '../shared/GameState.mjs';

let globalId = 0;

export default
class Game {
  players = {
    [CELL_X]: null,
    [CELL_O]: null
  };

  winStates = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  constructor() {
    this.gameState = new GameState();
    this.gameState.setGameId(`${globalId++}`);
    this.gameState.generateTurnKey();
    this.gameState.setSide(CELL_X);
  }

  get id() {
    return this.gameState.gameId;
  }

  get turnKey() {
    return this.gameState.turnKey;
  }

  join(userId, callback) {
    if (this.players[CELL_X] && this.players[CELL_X].userId !== userId) {
      this.players[CELL_O] = { callback, userId };
      callback(CELL_O);
    } else {
      this.players[CELL_X] = { callback, userId };
      callback(CELL_X);
    }
  }

  joinAI() {
    const ai = new AIPlayer(this, this.gameState);
    this.players[CELL_O] = { callback: ai.callback.bind(ai), id: 'ai' };
  }

  getStatus(statusFor) {
    const { map, isActiveGame, turnKey, wonSide, side } = this.gameState;
    return {
      map,
      isActiveGame,
      wonSide,
      side,
      turnKey: side === statusFor ? turnKey : null
    };
  }

  sendStatus() {
    if (this.players[CELL_X]) {
      this.players[CELL_X].callback(CELL_X);
    }
    if (this.players[CELL_O]) {
      this.players[CELL_O].callback(CELL_O);
    }
  }

  click(rowIndex, cellIndex) {
    const { isActiveGame, map } = this.gameState;
    if (!isActiveGame) {
      return;
    }
    const cellState = map[rowIndex][cellIndex];
    if (cellState !== CELL_EMPTY) {
      return;
    }
    this.gameState.fillCell(rowIndex, cellIndex);

    this.checkWinState();
    this.sendStatus();
  }

  evaluate(arr) {
    for (const [c1, c2, c3] of this.winStates) {
      if (arr[c1] === arr[c2] && arr[c2] === arr[c3] && arr[c1] === arr[c3] && arr[c1] !== CELL_EMPTY) {
        return arr[c1];
      }
    }
    if (!arr.includes(CELL_EMPTY)) {
      return CELL_TIE;
    }
    return false;
  }

  checkWinState() {
    const { map } = this.gameState;
    const res = this.evaluate(map.reduce((arr, item) => arr.concat(item), []));

    if (res) {
      this.gameState.win(res);
    }
  }
}
