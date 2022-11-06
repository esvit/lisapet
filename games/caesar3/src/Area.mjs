export default class Area {
    #start = null;

    #end = null;

    #startPoint = null;

    #endPoint = null;

    constructor(start, end) {
        this.#startPoint = start;
        this.#endPoint = end;

        this.#start = [];
        this.#end = [];

        this.#start[0] = start[0] <= end[0] ? start[0] : end[0];
        this.#end[0] = start[0] > end[0] ? start[0] : end[0];

        this.#start[1] = start[1] <= end[1] ? start[1] : end[1];
        this.#end[1] = start[1] > end[1] ? start[1] : end[1];
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    inArea(x, y) {
        if (x < this.#start[0] || x > this.#end[0]) {
            return false;
        }
        if (y < this.#start[1] || y > this.#end[1]) {
            return false;
        }
        return true;
    }

    * getCoordinates() {
        for (let x = this.#start[0]; x < this.#end[0]; x++) {
            for (let y = this.#start[1]; y < this.#end[1]; y++) {
                yield [x, y];
            }
        }
    }
}
