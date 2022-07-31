import State from '../../../src/State.mjs';

export default
class GameState extends State {
  get state() {
    return {
      gameId: null,
    };
  }

  get mutations() {
    return {
    };
  }
}
