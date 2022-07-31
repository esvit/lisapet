
export function rotatePointAroundPoint([ax, ay], [bx, by], angle) {
  const rad = (Math.PI / 180) * angle,
    cos = Math.cos(rad),
    sin = Math.sin(rad),
    run = bx - ax,
    rise = by - ay;

  return [
    (cos * run) + (sin * rise) + ax,
    (cos * rise) - (sin * run) + ay
  ];
}
