import { MAP_MOVE_BORDER } from '../constants.mjs';

let borderTimer = null;

// Допоміжні функції, які рухають карту, якщо курсор знаходиться біля краю області видимості
export function moveMapNearBorder(map, canvas, { x, y }) {
    let offset = [0, 0];
    if (x < MAP_MOVE_BORDER) {
        offset[0] = 50;
    }
    if (y < MAP_MOVE_BORDER) {
        offset[1] = 50;
    }
    if (x > canvas.width - MAP_MOVE_BORDER) {
        offset[0] = -50;
    }
    if (y > canvas.height - MAP_MOVE_BORDER) {
        offset[1] = -50;
    }
    if (borderTimer) {
        clearInterval(borderTimer);
        borderTimer = null;
    }
    if (offset[0] !== 0 || offset[1] !== 0) {
        borderTimer = setInterval(() => map.move(offset[0], offset[1]), 100);
    }
}

export function outMapNearBorder() {
    if (borderTimer) {
        clearInterval(borderTimer);
    }
    borderTimer = null;
}
