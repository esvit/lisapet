import {BUILDING_ENGINEERS_POST, LAYER_TERRAIN, LAYERS} from './constants.mjs';
import EventEmitter from '../../../src/EventEmitter.mjs';
import Map from './Map.mjs';
import Locale from './Locale.mjs';
import {addClass, addEventOnce, removeClass} from './helpers/dom.mjs';
import Shovel from './Tools/Shovel.mjs';
import House from './Tools/House.mjs';
import Road from './Tools/Road.mjs';
import Building from './Tools/Building.mjs';

const BUTTONS = [
    { tool: 'house', icon: 'house', title: Locale.t('house') },
    { tool: 'shovel', icon: 'shovel', title: Locale.t('shovel') },
    { tool: 'road', icon: 'road' },
    {
        building: 'water',
        icon: 'water',
        list: [
            { building: 'well', price: 100, title: Locale.t('wellTitle') },
        ]
    },
    {
        building: 'medical',
        icon: 'medical',
        list: [
            // { building: 'hospital', price: 100 },
        ]
    },
    {
        building: 'gods',
        icon: 'gods',
        list: [
            // { building: 'temple', price: 100 },
        ]
    },
    {
        building: 'edu',
        icon: 'edu',
        list: [
            // { building: 'temple', price: 100 },
        ]
    },
    {
        building: 'ent',
        icon: 'ent',
        list: [
            { building: 'theater', price: 100, title: Locale.t('theaterTitle') },
        ]
    },
    {
        building: 'gov',
        icon: 'gov',
        list: [
            { building: 'temple', price: 100, title: Locale.t('templeTitle') },
        ]
    },
    {
        building: 'eng',
        icon: 'eng',
        list: [
            { buildingId: BUILDING_ENGINEERS_POST, price: 100, title: Locale.t('engineerPostTitle') },
        ]
    },
    {
        building: 'prot',
        icon: 'prot',
        list: [
            // { building: 'engineer-post', price: 100, title: Locale.t('engineerPostTitle') },
        ]
    },
    {
        building: 'mar',
        icon: 'mar',
        list: [
            // { building: 'engineer-post', price: 100 },
        ]
    },
    { action: 'cancel', icon: 'cancel' },
    { action: 'messages', icon: 'messages' },
    { action: 'bell', icon: 'bell' }
];

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
    #buttons = {};

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

        this.initButtons();
        this.addEvents();
    }
    
    initButtons() {
        for (const button of BUTTONS) {
            const btn = document.createElement('button');
            if (button.tool) {
                btn.setAttribute('data-tool', button.tool);
            }
            if (button.building) {
                btn.setAttribute('data-building', button.building);
            }
            if (button.action) {
                btn.setAttribute('data-action', button.action);
            }
            if (button.title) {
                btn.setAttribute('title', button.title);
            }
            addClass(btn, 'btn', `icon-${button.icon}`);
            this.#buildButtons.appendChild(btn);
            this.#buttons[button.tool || button.building || button.action] = btn;
        }
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
                const groupName = btn.getAttribute('data-building');
                this.toggleBuildings(groupName, true);
            };
        }
        const emit = this.emit.bind(this);
        for (const btn of document.querySelectorAll('[data-tool]')) {
            btn.onclick = (e) => {
                e.preventDefault();
                const toolName = btn.getAttribute('data-tool');
                let tool;
                switch (toolName) {
                case 'road': tool = new Road(this.#map); break;
                case 'house': tool = new House(this.#map); break;
                case 'shovel': tool = new Shovel(this.#map); break;
                }
                emit('tool', tool);
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

    toggleOverlays() {
        this.#menuOverlays.classList.toggle('show');
    }

    toggleBuildings(group, show = null) {
        if (show === null) {
            this.#menuBuildings.classList.toggle('show');
        } else if (show) {
            this.#menuBuildings.classList.add('show');
        } else {
            this.#menuBuildings.classList.remove('show');
        }
        const groupButton = BUTTONS.find((button) => button.building === group);
        this.#menuBuildings.innerHTML = '';
        for (const item of groupButton.list) {
            const button = document.createElement('button');
            button.setAttribute('title', item.title);
            let title = item.title;
            if (item.price) {
                title += `<span>${item.price}Dn</span>`;
            }
            addClass(button, 'btn', 'btn-default', 'btn-block');
            button.innerHTML = title;
            addEventOnce(button, 'click', (e) => {
                const tool = new Building(this.#map, item.buildingId, item.price);
                this.emit('tool', tool);
                this.toggleBuildings(group, false);
            });
            this.#menuBuildings.appendChild(button);
        }
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
