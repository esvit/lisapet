import State from '../../../../src/State.mjs';
import { CELL_X, CELL_EMPTY, CELL_O } from './constants.mjs';

let eventSource = null;

export default
class GameState extends State {
  get state() {
    return {
      gameId: null,
      isActiveGame: true,
      turnKey: null,
      wonSide: null,
      side: CELL_X,
      map: [
        [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
        [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
        [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
      ]
    };
  }

  get mutations() {
    return {
      setGameId: ({ state }, id) => state.gameId = id,
      setMap: ({ state }, map) => state.map = map,
      setTurnKey: ({ state }, key) => state.turnKey = key,
      setSide: ({ state }, side) => state.side = side,
      setWonSide: ({ state }, side) => {
        state.wonSide = side;
        state.isActiveGame = false;
      },
      setMapCell: ({ state }, side) => {
        state.wonSide = side;
        state.isActiveGame = false;
      },
      setGameParams: ({ state }, { isActiveGame, turnKey, wonSide, side }) => {
        state.isActiveGame = isActiveGame;
        state.turnKey = turnKey;
        state.wonSide = wonSide;
        state.side = side;
      }
    };
  }

  win({ setWonSide }, side) {
    setWonSide(side);
    eventSource && eventSource.close();
  }

  fillCell({ state, setTurnKey }, x, y) {
    const { map } = state;
    map[x][y] = state.side;
    state.side = (state.side === CELL_X) ? CELL_O : CELL_X;
    this.generateTurnKey({ setTurnKey });
  }

  generateTurnKey({ setTurnKey }) {
    setTurnKey(`key${Math.random()}`);
  }

  connectToServer({ state, emit, setGameId, setMap, setGameParams }, serverUrl, userId, withAI = false) {
    const url = new URL(window.location);
    serverUrl += `/?userId=${userId}&ai=${withAI ? '1' : '0'}`;
    if (url.searchParams.has('gameId')) {
      serverUrl += `&gameId=${url.searchParams.get('gameId')}`;
    }
    eventSource = new EventSource(serverUrl);
    eventSource.onmessage = ({ lastEventId, data }) => {
      if (!state.gameId) {
        url.searchParams.set('gameId', lastEventId);
        window.history.pushState({ gameId: lastEventId }, '', url);
      }
      setGameId(lastEventId);

      const { map, isActiveGame, turnKey, wonSide, side } = JSON.parse(data);

      setMap(map);
      setGameParams({ isActiveGame, turnKey, wonSide, side });

      emit('turn', side);
    }
  }
}
