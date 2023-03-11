export default class AbstractTool {
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
