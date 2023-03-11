import Scene from '../../../../src/Scene.mjs';
import { moveMapNearBorder, outMapNearBorder } from '../helpers/moveMapNearBorder.mjs';
import { MOUSE_RIGHT_BUTTON } from '../../../../src/InputManager.mjs';
import { RESOURCE_ATLASES } from '../constants.mjs';
import {addEventOnce} from "../helpers/dom.mjs";

export default
class GameScene extends Scene {
    #di = null;

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

    #walkers = [];

    #mapImage = null;

    #tickTimer = null;

    constructor({ di, canvas, DrawingContext, ResourceManager, InputManager, GameUI }) {
        super();

        this.#di = di;
        this.#canvas = canvas;
        this.#drawingContext = DrawingContext;
        this.#resourceManager = ResourceManager;
        this.#inputManager = InputManager;
        this.#gameUI = GameUI;
    }

    get map() {
        return this.#map;
    }

    set map(val) {
        this.#map = val;
        this.#mapImage = null;
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
        await this.#resourceManager.loadBatch(RESOURCE_ATLASES);
        this.resume();
    }

    draw() {
        if (!this.#map) {
            return;
        }

        if (!this.#mapImage) {
            const image = this.#map.redraw();
            this.#mapImage = image;
        }
        const [offsetX, offsetY] = this.#map.mapOffset;
        this.#drawingContext.drawImage(this.#mapImage, offsetX, offsetY, this.#map.drawWidth, this.#map.drawHeight);
    }

    pause() {
        this.#inputManager.off('click');
        this.#inputManager.off('move');
        this.#inputManager.off('mouseout');
        this.#inputManager.off('mousedown');
        this.#gameUI.off('tool');
    }
    
    resize() {
        if (!this.#map) {
            return;
        }
        this.#map.visibleAreaSize = [this.#drawingContext.width, this.#drawingContext.height];
    }

    resume() {
        this.#inputManager.on('click', this.click.bind(this));
        this.#inputManager.on('move', this.move.bind(this));
        this.#inputManager.on('mouseout', this.mouseout.bind(this));
        this.#inputManager.on('mousedown', this.mousedown.bind(this));
        this.#canvas.addEventListener('wheel', (e) => {
            e.preventDefault(); // disable the actual scrolling

            this.resize();
            this.#map.move(-e.deltaX, -e.deltaY);
        }, { passive: false });
        this.#gameUI.on('tool', (tool) => {
            this.selectedTool = tool;
        });

        this.setSpeed(7);
        setInterval(() => {
            if (!this.#map) {
                return;
            }
            const image = this.#map.redraw();
            this.#mapImage = image;
        }, 100);
    }

    setSpeed(speed) {
        const MILLIS_PER_TICK_PER_SPEED = [
            702, 502, 352, 242, 162, 112, 82, 57, 37, 22, 16
        ];
        if (this.#tickTimer) {
            clearInterval(this.#tickTimer);
        }
        if (speed > 0) {
            this.#tickTimer = setInterval(() => {
                if (!this.#map) {
                    return;
                }
                this.#gameUI.tick();
                this.#map.tick();
                window.tick = window.tick || 0;
                window.tick++;
                if (window.tick > 999) {
                    window.tick = 0;
                }
            }, MILLIS_PER_TICK_PER_SPEED[speed]);
        }
    }

    click({ x, y }) {
        if (!this.#map) {
            return;
        }
        if (!this.#map.selectedAreaTool) {
        }
    }

    move({ x, y }) {
        if (!this.#map) {
            return;
        }
        const [mapX, mapY] = this.#map.fromCordinates(x, y);
        if (this.#mouseSelectArea && this.#selectedTool.isDraggable) {
            this.#mouseSelectArea[1] = [mapX, mapY];
            this.#map.selectedAreaTool = this.#selectedTool; // передаємо інструмент в карту, щоб там вже намалювати потрібне
            this.#map.selectedArea = this.#mouseSelectArea;
        } else if (this.#map.selectedArea) {
            this.#map.selectedArea[1] = [null, null];
        }
        this.#map.mouseMove(mapX, mapY);

        moveMapNearBorder(this.#map, this.#canvas, { x, y });
    }

    mouseout({ x, y }) {
        if (!this.#map) {
            return;
        }
        outMapNearBorder();
    }

    mousedown({ x, y, button }) {
        if (!this.#map) {
            return;
        }
        if (button === MOUSE_RIGHT_BUTTON) { // відловити в кліку це не можна, бо показує контексне меню
            stop();
            if (this.selectedTool === null) {
                const [mapX, mapY] = this.#map.fromCordinates(x, y);
                const terrainInfo = this.#map.getTerrainInfo(mapX, mapY)
                const {tile, edge, minimapInfo, elevation, buildingId} = this.#map.get(mapX, mapY)

                if (buildingId) {
                    const house = this.#map.buildings.getById(buildingId);
                    console.info(house)
                    this.#gameUI.showBuildingInfoDialog(house);
                } else {
                    // const people = this.#map.walkers.findByXY(mapX, mapY);
                    // if (people.length) {
                    //     console.info(people);
                    //     window.person = people[0];
                    // } else {
                        this.#gameUI.showTerrainInfoDialog({
                            ...terrainInfo,
                            tile,
                            edge,
                            elevation,
                            minimapInfo,
                            mapX, mapY
                        });
                    // }
                }
            } else {
                this.selectedTool = null;
            }
            return;
        }
        if (this.#selectedTool && !this.#selectedTool.isDraggable) {
            const [mapX, mapY] = this.#map.fromCordinates(x, y);
            this.#mouseSelectArea = [
                [mapX, mapY],
                [null, null]
            ];
            addEventOnce(window, 'mouseup', this.mouseup.bind(this));
        } else if (this.#map.selectedAreaTool) {
            const [mapX, mapY] = this.#map.fromCordinates(x, y);
            this.#mouseSelectArea = [
                [mapX, mapY],
                [null, null]
            ];
            addEventOnce(window, 'mouseup', this.mouseup.bind(this));
        }
    }

    mouseup(e) {
        if (!this.#map) {
            return;
        }
        if (this.#selectedTool) {
            if (this.#selectedTool.apply(this.#map, this.#mouseSelectArea || this.#map.selectedArea)) {
                this.selectedTool = null;
            }
        }
        this.#map.selectedArea = null;
        this.#mouseSelectArea = null;
    }
}
