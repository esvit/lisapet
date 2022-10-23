export function random(max, min = 0) {
    return Math.floor(min + (Math.random() * (max - min + 1)));
}

export function pad(number, size = 2) {
    const s = `${'0'.repeat(size)}${number}`;
    return s.substr(s.length - size);
}

