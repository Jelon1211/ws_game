export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(dx: number, dy: number) {
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len === 0) return { x: 0, y: 0 };

  return {
    x: dx / len,
    y: dy / len,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
