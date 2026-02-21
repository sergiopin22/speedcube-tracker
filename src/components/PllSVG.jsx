export default function PllSVG({ size = 100, learned = false }) {
  const padding = size * 0.1;
  const sideH = size * 0.11;
  const cellSize = (size - padding * 2) / 3;
  const totalSize = size + sideH * 2;
  const ox = sideH, oy = sideH;

  const yellow = '#FFD700';
  const bg = learned ? '#0e2412' : '#10101e';
  const border = learned ? '#1e3e24' : '#252540';

  const rects = [];

  // Top face - all yellow
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = ox + padding + c * cellSize;
      const y = oy + padding + r * cellSize;
      rects.push(
        <rect key={`t${r}${c}`} x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} fill={yellow} rx={3} stroke={border} strokeWidth={0.5} />
      );
    }
  }

  // Colored side stickers
  const sideColors = ['#ff6b35', '#3b82f6', '#ef4444', '#22c55e'];
  [0, 1, 2, 3].forEach(face => {
    for (let i = 0; i < 3; i++) {
      let x, y, w, h;
      if (face === 0) { x = ox + padding + i * cellSize; y = oy + padding - sideH; w = cellSize; h = sideH; }
      else if (face === 1) { x = ox + padding + 3 * cellSize; y = oy + padding + i * cellSize; w = sideH; h = cellSize; }
      else if (face === 2) { x = ox + padding + (2 - i) * cellSize; y = oy + padding + 3 * cellSize; w = cellSize; h = sideH; }
      else { x = ox + padding - sideH; y = oy + padding + (2 - i) * cellSize; w = sideH; h = cellSize; }
      rects.push(
        <rect key={`ps${face}${i}`} x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill={sideColors[face]} rx={2} opacity={0.7} />
      );
    }
  });

  return (
    <svg width={totalSize} height={totalSize} viewBox={`0 0 ${totalSize} ${totalSize}`} style={{ flexShrink: 0 }}>
      <rect width={totalSize} height={totalSize} fill={bg} rx={8} />
      {rects}
      <rect x={ox + padding} y={oy + padding} width={cellSize * 3} height={cellSize * 3} fill="none" stroke={border} strokeWidth={2} rx={2} />
    </svg>
  );
}
