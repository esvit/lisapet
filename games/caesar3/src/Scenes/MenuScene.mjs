import DependencyInjection from '/src/DependencyInjection.mjs';
import SceneManager from '/src/SceneManager.mjs';
import ResourceManager from '/src/ResourceManager.mjs';
import DrawingContext from '/src/DrawingContext.mjs';
import InputManager from '/src/InputManager.mjs';
import GameUI from '../GameUI.mjs';
import GameScene from './GameScene.mjs';
import GameDialogs from '../GameDialogs.mjs';
import { addEventOnce, addEvent } from '../helpers/dom.mjs';
import Map from "../Map.mjs";

export default
class MenuScene {
  #prescreen = null;
  #menu = null;
  #mainScreen = null;
  #googleButton = null;
  
  async startMenu() {
    this.#prescreen = document.getElementById('pre-screen');
    this.#menu = document.getElementById('menu-screen');
    this.#mainScreen = document.getElementById('main-screen');
    this.#googleButton = document.getElementById('google-button');

    addEventOnce(window, 'click', this.showMainMenu.bind(this));
    addEvent(document.getElementById('backToMenu'), 'click', this.showMainMenu.bind(this));
    addEvent(document.getElementById('startNewGame'), 'click', this.onStartNewGameClick.bind(this));

    window.GameDialogs = GameDialogs;
    this.#prescreen.innerText = 'Click on the page to start\nКлікніть по сторінці, щоб почати';
  }
  
  stopAudio() {
    const audio = document.getElementById('audio');
    audio.pause();
  }
  
  showMainMenu() {
    this.#mainScreen.classList.remove('in');
    this.#prescreen.classList.remove('in');
    this.#menu.classList.add('in');
    
    // start audio from 2:10
    const audio = document.getElementById('audio');
    audio.currentTime = 60 + 60 + 10;
    audio.play();
    
    this.initGoogleButton();
  }
  
  async onStartNewGameClick() {
    const name = await GameDialogs.askNameDialog();
    await GameDialogs.showMissionDialog();
    this.#menu.classList.remove('in');
    this.stopAudio();

    this.#mainScreen.classList.add('in');
    this.startGame(name);
  }
  
  async initGoogleButton() {
    const createScript = () => {
      return new Promise((resolve, reject) => {
        const el = document.getElementById('auth2_script_id');
        if (!el) {
          const gplatformScript = document.createElement('script');
          gplatformScript.setAttribute('src', '//accounts.google.com/gsi/client');
          gplatformScript.setAttribute('async', true);
          gplatformScript.setAttribute('defer', 'defer');
          gplatformScript.setAttribute('id', 'auth2_script_id');
          gplatformScript.onload = () => {
            resolve(window.google);
          };
          gplatformScript.onerror = () => {
            reject(new Error('Failed to load Google Auth API'));
          };
          document.head.appendChild(gplatformScript);
        } else {
          resolve(window.google);
        }
      });
    };

    await createScript();
    if (typeof google === 'undefined') {
      throw new TypeError('Google Auth API not loaded');
    }
    // eslint-disable-next-line no-undef
    google.accounts.id.initialize({
      client_id: '401419860933-s0ca3ljvhi69erqbtvsdtft497pot62n.apps.googleusercontent.com',
      callback: this.handleOneTap,
      cancel_on_tap_outside: false
    });
    // OneTap
    google.accounts.id.prompt();
    const { width } = this.#googleButton.getBoundingClientRect();
    // eslint-disable-next-line no-undef
    google.accounts.id.renderButton(
      this.#googleButton,
      { theme: 'filled_blue', shape: 'square', size: 'large', width: Math.round(width) }
    );
  }
  
  async startGame() {
    const di = DependencyInjection.createRoot({
      ResourceManager,
      DrawingContext,
      InputManager,
      GameUI
    });
    const mainCanvas = document.getElementById('main');
    di.set('canvas', mainCanvas);

    const sceneManager = di.get(SceneManager);
    const drawingContext = di.get(DrawingContext);
    const resourceManager = di.get(ResourceManager);

    const scene = await sceneManager.loadScene(GameScene);


    const mapData = await resourceManager.loadJsonByUrl('maps/Brigantium.map.json');
    sceneManager.currentScene.map = new Map(di, mapData);
    sceneManager.currentScene.resize();
    setTimeout(() => { sceneManager.currentScene.resize(); }, 100);

    // const mapData = Map.createEmpty(50, 50);
    // sceneManager.currentScene.map = new Map(this.#di, mapData);

    drawingContext.bindToElement(document.getElementById('mapContainer'));
    drawingContext.loop();
  }
}
