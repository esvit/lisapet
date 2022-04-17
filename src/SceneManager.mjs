export default
class SceneManager {
  #currentScene = null;

  constructor({ di, DrawingContext }) {
    this.di = di;
    this.drawingContext = DrawingContext;

    this.drawingContext.on('draw', this.drawScene.bind(this));
  }

  async loadScene(sceneDiName, ...args) {
    const scene = this.di.get(sceneDiName);

    if (this.#currentScene) {
      this.#currentScene.pause();
      this.#currentScene.__isPaused = true;
    }
    if (scene.__isPaused) {
      scene.resume();
      this.#currentScene.__isPaused = false;
    } else {
      await scene.loading.apply(scene, args);
    }

    this.#currentScene = scene;

    await scene.start.apply(scene, args);
  }

  drawScene() {
    if (!this.#currentScene) {
      return;
    }
    this.#currentScene.draw();
  }
}
