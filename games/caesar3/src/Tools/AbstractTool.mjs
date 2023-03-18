export default class AbstractTool {
    map = null;

    #code = null;

    #tiles = [];
    
    constructor(map, code = null, tiles = []) {
        this.map = map;
        this.#code = code;
        this.#tiles = tiles;
    }

    get code() {
        return this.#code;
    }

    get tiles() {
        return this.#tiles;
    }

    set tiles(val) {
        this.#tiles = val;
    }

    get price() {
        return 0;
    }

    prepareArea(area) {

    }
    
    get isDraggable() {
        return true;
    }

    /**
     * 
     * @param map
     * @param start
     * @param end
     * @returns {boolean} Якщо true, то вибраний tool очищається
     */
    apply(map, [start, end]) {
        // abstract
    }

    mouseMove(map, x, y) {
        // abstract
    }

    drawHoverCell(map, x, y, tile) {
        // abstract
    }
}
