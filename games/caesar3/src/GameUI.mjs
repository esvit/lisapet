import {LAYER_TERRAIN, LAYERS} from './constants.mjs';
import EventEmitter from '../../../src/EventEmitter.mjs';

export default
class GameUI extends EventEmitter {
    #menuOverlays = null;

    #menuBuildings = null;

    /**
     * Картинка, яка показує вибраний інструмент selectedAreaTool
     * @type {Element}
     */
    #imgPlaceholder = null;

    #map = null;

    #selectedTool = null;

    constructor() {
        super();

        this.#menuOverlays = document.getElementById('menuOverlays');
        this.#menuBuildings = document.getElementById('menuBuildings');
        this.#imgPlaceholder = document.getElementById('imgPlaceholder');

        this.addEvents();
    }

    bind(map) {
        this.#map = map;
    }

    addEvents() {
        document.getElementById('showMissionDialog').onclick = (e) => {
            e.preventDefault();
            this.showMissionDialog();
        };
        document.getElementById('showVideoDialog').onclick = (e) => {
            e.preventDefault();
            this.showVideoDialog();
        };
        document.getElementById('showNameDialog').onclick = (e) => {
            e.preventDefault();
            this.showDialog('nameDialog');
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
            if (typeof values[key] !== 'undefined') {
                elem.innerHTML = values[key];
            }
        }
    }

    showDialog(id, values = {}) {
        const dialog = document.getElementById(id);
        this.bindValues(dialog, values);
        dialog.show();
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
}
