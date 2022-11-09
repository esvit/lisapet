import Scene from '../../../../src/Scene.mjs';
import { moveMapNearBorder, outMapNearBorder } from '../helpers/moveMapNearBorder.mjs';
import {MOUSE_RIGHT_BUTTON} from "../../../../src/InputManager.mjs";
import {TOOLS_HOUSE, TOOLS_ROAD, TOOLS_SHOVEL} from "../constants.mjs";
import Shovel from '../Tools/Shovel.mjs';
import House from '../Tools/House.mjs';
import Road from '../Tools/Road.mjs';

const NORTH_ATLAS = 'atlases/north1.atlas';
const MAIN_ATLAS = 'atlases/main1.atlas';

export default
class GameScene extends Scene {
    #map = null;

    #canvas = null;

    #drawingContext = null;

    #resourceManager = null;

    #inputManager = null;

    #gameUI = null;

    #mouseSelectArea = null;

    /**
     * Вибраний інструмент будівництва
     *
     * @type {number|null}
     */
    #selectedTool = null;

    #tools = {};

    constructor({ canvas, DrawingContext, ResourceManager, InputManager, GameUI }) {
        super();

        this.#canvas = canvas;
        this.#drawingContext = DrawingContext;
        this.#resourceManager = ResourceManager;
        this.#inputManager = InputManager;
        this.#gameUI = GameUI;

        this.#tools = {
            [TOOLS_HOUSE]: new House(),
            [TOOLS_SHOVEL]: new Shovel(),
            [TOOLS_ROAD]: new Road(),
        };
    }

    get map() {
        return this.#map;
    }

    set map(val) {
        this.#map = val;
        this.#gameUI.bind(val);
    }

    get selectedTool() {
        return this.#selectedTool;
    }

    set selectedTool(tool) {
        this.#gameUI.selectTool(tool ? tool.name : null);
        this.#map.selectedAreaTool = tool;
        this.#selectedTool = tool;
        if (!name) {
            this.#mouseSelectArea = null;
            this.#map.selectedArea = null;
        }
    }

    async loading() {
        // await this.resourceManager.loadBatch([
        //   NORTH_ATLAS // завантажити перед основним
        // ]);
        await this.#resourceManager.loadBatch([
            MAIN_ATLAS
        ]);
        this.resume();
    }

    draw() {
        if (!this.#map) {
            return;
        }

        const image = this.#map.redraw();
        const [offsetX, offsetY] = this.#map.mapOffset;
        this.#drawingContext.drawImage(image, offsetX, offsetY, this.#map.drawWidth, this.#map.drawHeight);
    }

    pause() {
        this.#inputManager.off('click');
        this.#inputManager.off('move');
        this.#inputManager.off('mouseout');
        this.#inputManager.off('mousedown');
        this.#gameUI.off('tool');
    }

    resume() {
        this.#inputManager.on('click', this.click.bind(this));
        this.#inputManager.on('move', this.move.bind(this));
        this.#inputManager.on('mouseout', this.mouseout.bind(this));
        this.#inputManager.on('mousedown', this.mousedown.bind(this));
        this.#canvas.addEventListener('wheel', (e) => {
            e.preventDefault(); // disable the actual scrolling

            this.#map.visibleAreaSize = [this.#drawingContext.width, this.#drawingContext.height];
            this.#map.move(-e.deltaX, -e.deltaY);
        }, { passive: false });
        this.#gameUI.on('tool', (name) => {
            this.selectedTool = this.#tools[name];
        })
    }

    click({ x, y }) {
        if (!this.#map.selectedAreaTool) {
            const [mapX, mapY] = this.#map.fromCordinates(x, y);
            const terrainInfo = this.#map.getTerrainInfo(mapX, mapY)
            const {tile, edge, minimapInfo, elevation} = this.#map.get(mapX, mapY)
            this.#gameUI.showTerrainInfoDialog({
                ...terrainInfo,
                tile,
                edge,
                elevation,
                minimapInfo,
                mapX, mapY
            });
        }
    }

    move({ x, y }) {
        if (!this.#map) {
            return;
        }
        if (this.#mouseSelectArea) {
            this.#mouseSelectArea[1] = [x, y];
            this.#map.selectedAreaTool = this.#selectedTool; // передаємо інструмент в карту, щоб там вже намалювати потрібне
            this.#map.selectedArea = this.#mouseSelectArea;
        } else {
            this.#map.selectedArea = null;
        }
        this.#map.mouseMove(x, y);

        moveMapNearBorder(this.#map, this.#canvas, { x, y });
    }

    mouseout({ x, y }) {
        if (!this.#map) {
            return;
        }
        outMapNearBorder();
    }

    mousedown({ x, y, button, stop }) {
        if (button === MOUSE_RIGHT_BUTTON) { // відловити в кліку це не можна, бо показує контексне меню
            this.selectedTool = null;
            stop();
            return;
        }
        if (this.#map.selectedAreaTool) {
            this.#mouseSelectArea = [
                [x, y],
                [null, null]
            ];
            this.mouseUpHandler = this.mouseup.bind(this);
            window.addEventListener('mouseup', this.mouseUpHandler);
        }
    }

    mouseup(e) {
        if (this.#map.selectedArea) {
            this.#map.applyTool(this.#map.selectedArea, this.#selectedTool);
        }
        this.#map.selectedArea = null;
        this.#mouseSelectArea = null;
        if (this.mouseUpHandler) {
            window.removeEventListener('mouseup', this.mouseUpHandler);
            this.mouseUpHandler = null;
        }
    }
}
