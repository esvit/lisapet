import { CELL_EMPTY, CELL_O, CELL_X, CELL_TIE } from '../shared/constants.mjs';

const AI_TURN_TIMEOUT = 500;

export default
class AIPlayer {
  constructor(game, gameState) {
    this.game = game;
    this.gameState = gameState;
  }

  callback() {
    const { side, map } = this.gameState;
    if (side !== CELL_O) {
      return;
    }
    const arr = map.reduce((arr, item) => arr.concat(item), []);

    let index = 0;
    let bestScore = -1000;
    let bestRow = null;
    let bestCell = null;

    for (const rowIndex in map) {
      const row = map[rowIndex];
      for (const cellIndex in row) {
        const cells = [...arr];
        if (row[cellIndex] === CELL_EMPTY) {
          cells[index] = CELL_O;
          const score = this.minmax(cells, 0, false);
          if (score > bestScore) {
            bestScore = score;
            bestRow = rowIndex;
            bestCell = cellIndex;
          }
        }
        index++;
      }
    }
    setTimeout(() => {
      if (bestRow === null) {
        for (const rowIndex in map) {
          const row = map[rowIndex];
          for (const cellIndex in row) {
            if (row[cellIndex] === CELL_EMPTY) {
              this.game.click(rowIndex, cellIndex);
              return;
            }
          }
        }
      } else {
        this.game.click(bestRow, bestCell);
      }
    }, AI_TURN_TIMEOUT);
  }

  minmax(cells, depth, isMax) {
    let score = this.game.evaluate(cells);
    if (score === CELL_TIE) {
      return 0;
    }
    if (score) {
      return score === CELL_O ? 10 : -10;
    }

    const arr = [...cells];

    let bestScore = isMax ? -1000 : 1000;

    for (const cellIndex in arr) {
      if (arr[cellIndex] === CELL_EMPTY) {
        arr[cellIndex] = isMax ? CELL_O : CELL_X;

        const minmaxScore = this.minmax(arr,depth + 1, !isMax);
        bestScore = isMax ? Math.max(bestScore, minmaxScore) : Math.min(bestScore, minmaxScore);

        arr[cellIndex] = CELL_EMPTY;
      }
    }
    return bestScore;
  }
}
