export default 
class GameState {
  #funds = 0;

  #population = 0;

  #buildings = [];

  #figures = [];
  
  constructor({ initialState }) {
    this.#funds = initialState.funds;
    this.#population = 0;
  }
  
  get funds() {
    return this.#funds;
  }
  
  get population() {
    return this.#population;
  }
  
  get buildings() {
    return this.#buildings;
  }
  
  get figures() {
    return this.#figures;
  }

  addBuilding(building) {
    this.#buildings.push(building);
    building.on('delete', () => {
      this.#buildings = this.#buildings.filter((b) => b !== building);
    });
    return building;
  }

  addFigure(figure) {
    this.#figures.push(figure);
    return figure;
  }

  removeFigure(figure) {
    const index = this.#figures.findIndex((f) => f === figure);
    if (index === -1) {
      throw new Error('Figure not found');
    }
    this.#figures.splice(index, 1);
  }
  
  tick() {
    for (const building of this.#buildings) {
      building.tick();
    }
    for (const figure of this.#figures) {
      figure.tick();
    }
  }
}
