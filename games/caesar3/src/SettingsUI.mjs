import {LAYER_TERRAIN, LAYER_ROAD, LAYER_GRID} from './constants.mjs';

export default
class SettingsUI {
    #panel = null;

    constructor({ map }) {
        this.map = map;
    }

    destroy() {
        this.#panel.destroy();
        this.#panel = null;
    }

    init(x, y) {
        this.#panel = QuickSettings.create(x, y, 'Settings');

        this.#panel.addRange('Zoom', 0.5, 1.5, 1, 0.25, (val) => {
            this.map.zoom = val;
        });
        this.#panel.addBoolean('Terrain', this.map.enabledLayers & LAYER_TERRAIN, (val) => {
            this.map.enabledLayers = val ? (this.map.enabledLayers | LAYER_TERRAIN) : (this.map.enabledLayers ^ LAYER_TERRAIN);
        });
        this.#panel.addBoolean('Road', this.map.enabledLayers & LAYER_ROAD, (val) => {
            this.map.enabledLayers = val ? (this.map.enabledLayers | LAYER_ROAD) : (this.map.enabledLayers ^ LAYER_ROAD);
        });
        this.#panel.addBoolean('Grid', this.map.enabledLayers & LAYER_GRID, (val) => {
            this.map.enabledLayers = val ? (this.map.enabledLayers | LAYER_GRID) : (this.map.enabledLayers ^ LAYER_GRID);
        });
    }
}
