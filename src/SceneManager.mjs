export default
class SceneManager {
  #currentScene = null;

  constructor({ DrawingContext }) {
    this.drawingContext = DrawingContext;

    this.drawingContext.on('draw', this.drawScene.bind(this));
  }

  async loadScene(scene, ...args) {
    if (scene.__isPaused) {
      scene.resume();
      return;
    }
    if (this.#currentScene) {
      this.#currentScene.pause();
      this.#currentScene.__isPaused = true;
    }

    await scene.loading(args);

    this.#currentScene = scene;

    await scene.start(args);
  }

  drawScene() {
    if (!this.#currentScene) {
      return;
    }
    this.#currentScene.draw();
  }
}
