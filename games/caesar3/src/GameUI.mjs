import {LAYER_TERRAIN, LAYERS} from './constants.mjs';
import EventEmitter from '../../../src/EventEmitter.mjs';
import Map from './Map.mjs';
import { addClass, removeClass } from './helpers/dom.mjs';

export default
class GameUI extends EventEmitter {
    #menuOverlays = null;

    #menuBuildings = null;

    /**
     * Картинка, яка показує вибраний інструмент selectedAreaTool
     * @type {Element}
     */
    #imgPlaceholder = null;

    #di = null;

    #map = null;

    #moneyStat = null;
    #populationStat = null;
    #yearStat = null;
    #buildButtons = null;
    #nav = null;
    #sidebar = null;
    #ui = null;

    #selectedTool = null;

    constructor({ di }) {
        super();

        this.#di = di;
        this.#menuOverlays = document.getElementById('menuOverlays');
        this.#menuBuildings = document.getElementById('menuBuildings');
        this.#imgPlaceholder = document.getElementById('imgPlaceholder');
        this.#moneyStat = document.getElementById('moneyStat');
        this.#populationStat = document.getElementById('populationStat');
        this.#yearStat = document.getElementById('yearStat');
        this.#buildButtons = document.getElementById('build-buttons');
        this.#nav = document.getElementById('main-navbar');
        this.#sidebar = document.getElementById('main-sidebar');
        this.#ui = [this.#nav, this.#sidebar];

        this.addEvents();
    }
    
    hideUi() {
        addClass(this.#ui, 'd-none');
    }
    
    showUi() {
        removeClass(this.#ui, 'd-none');
    }

    bind(map) {
        this.#map = map;
    }

    addEvents() {
        // document.getElementById('loadSaveGame').onclick = async (e) => {
        //     e.preventDefault();
        //     const resourceManager = this.#di.get('ResourceManager');
        //     const sceneManager = this.#di.get('SceneManager');
        //     const mapData = await resourceManager.loadJsonByUrl('maps/saved_game.sav.json');
        //     sceneManager.currentScene.map = new Map(this.#di, mapData);
        //     sceneManager.currentScene.resize();
        // };
        document.getElementById('showVideoDialog').onclick = (e) => {
            e.preventDefault();
            this.showVideoDialog();
        };
        document.getElementById('btnOverlay').onclick = (e) => {
            e.preventDefault();
            this.refreshOverlaysMenu();
            this.toggleOverlays();
        };

        for (const btn of document.querySelectorAll('[data-building]')) {
            btn.onclick = (e) => {
                e.preventDefault();
                this.toggleBuildings();

                this.#map.addImmigrantWalker();
            };
        }
        const emit = this.emit.bind(this);
        for (const btn of document.querySelectorAll('[data-tool]')) {
            btn.onclick = function (e) {
                e.preventDefault();
                const toolName = this.getAttribute('data-tool');
                emit('tool', toolName);
            };
        }
    }

    bindValues(el, values) {
        const els = el.querySelectorAll('[data-bind]');
        for (const elem of els) {
            const key = elem.getAttribute('data-bind');
            const value = this.getField(values, key);
            if (typeof value !== 'undefined') {
                elem.innerHTML = value;
            }
        }
    }

    getField(obj, field) {
        const parts = field.split('.');
        let current = obj;
        for (const part of parts) {
            const key = Array.isArray(current) ? Number(part) : part;
            current = typeof current !== 'undefined' ? current[key] : undefined;
        }
        return current;
    }
    
    showDialog(id, values = {}) {
        const dialog = document.getElementById(id);
        this.bindValues(dialog, values);
        setTimeout(() => {
            dialog.show();
        }, 1); // потрібна затримка, бо коли правою кнопкою клацаєш, то приховується контексне меню, якщо без затримки, то буде відображатись
        const closeBtn = dialog.querySelector('[data-action="close"]');
        const hide = (e) => {
            e.preventDefault();
            closeBtn.removeEventListener('click', hide);
            dialog.close();
        };
        closeBtn.addEventListener('click', hide);
        return dialog;
    }

    showMissionDialog() {
        this.showDialog('missionDialog');
    }

    toggleOverlays() {
        this.#menuOverlays.classList.toggle('show');
    }

    toggleBuildings() {
        this.#menuBuildings.classList.toggle('show');
    }

    showVideoDialog() {
        const dialog = this.showDialog('videoDialog');
        document.getElementById('video').currentTime = 0;
        document.getElementById('video').play();
        dialog.addEventListener('close', () => {
            document.getElementById('video').currentTime = 0;
            document.getElementById('video').pause();
        });
    }

    showBuildingInfoDialog(info) {
        const dialog = this.showDialog('buildingInfo', info);
        dialog.addEventListener('close', () => {
        });
    }

    showTerrainInfoDialog(info) {
        const dialog = this.showDialog('terrainInfoDialog', info);
        dialog.addEventListener('close', () => {
        });
    }

    refreshOverlaysMenu() {
        if (!this.#map) {
            return;
        }
        const enabled = this.#map.enabledLayers;
        const nodes = [];
        for (const layer of LAYERS) {
            const postfix = (enabled & layer.id) ? 'on' : 'off'
            const btn = document.createElement('button');
            btn.setAttribute('class', 'btn btn-block btn-default');
            btn.textContent = `${layer.title} (${postfix})`;
            btn.onclick = (e) => {
                const isEnabled = (this.#map.enabledLayers & layer.id);
                console.info(isEnabled, this.#map.enabledLayers | layer.id, this.#map.enabledLayers ^ layer.id)
                this.#map.enabledLayers = !isEnabled ? (this.#map.enabledLayers | layer.id) : (this.#map.enabledLayers ^ layer.id);
                this.refreshOverlaysMenu();
            };
            nodes.push(btn);
        }
        this.#menuOverlays.replaceChildren(...nodes);
    }

    selectTool(name) {
        this.#imgPlaceholder.setAttribute('class', `img-placeholder tool-${name}`);
    }
    
    tick() {
        if (!this.#map) {
            return;
        }
        document.querySelector('.stats').style.display = 'flex';
        this.#moneyStat.innerText = `Dn ${this.#map.state.funds}`;
        this.#populationStat.innerText = `Pop ${this.#map.state.population}`;
        this.#yearStat.innerText = `Feb 332 BC`;
    }
}
