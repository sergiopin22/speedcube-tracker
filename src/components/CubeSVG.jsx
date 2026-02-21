export default function CubeSVG({ topFace, sides, size = 100, learned = false }) {
  const padding = size * 0.1;
  const sideH = size * 0.11;
  const cellSize = (size - padding * 2) / 3;
  const totalSize = size + sideH * 2;
  const ox = sideH, oy = sideH;

  const yellow = '#FFD700';
  const gray = learned ? '#2a4a2e' : '#3a3a52';
  const yellowSide = '#FFD700';
  const graySide = learned ? '#3a5a3e' : '#555570';
  const bg = learned ? '#0e2412' : '#10101e';
  const border = learned ? '#1e3e24' : '#252540';

  const rects = [];

  // Side stickers: back(0-2), right(3-5), front(6-8), left(9-11)
  const sideConfigs = [
    ...Array.from({ length: 3 }, (_, i) => ({ x: ox + padding + i * cellSize, y: oy + padding - sideH, w: cellSize, h: sideH, idx: i })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: ox + padding + 3 * cellSize, y: oy + padding + i * cellSize, w: sideH, h: cellSize, idx: 3 + i })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: ox + padding + (2 - i) * cellSize, y: oy + padding + 3 * cellSize, w: cellSize, h: sideH, idx: 6 + i })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: ox + padding - sideH, y: oy + padding + (2 - i) * cellSize, w: sideH, h: cellSize, idx: 9 + i }))
  ];

  sideConfigs.forEach(({ x, y, w, h, idx }) => {
    const color = sides[idx] ? yellowSide : graySide;
    rects.push(
      <rect key={`s${idx}`} x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill={color} rx={2} opacity={0.6} />
    );
  });

  // Top face
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = ox + padding + c * cellSize;
      const y = oy + padding + r * cellSize;
      const isYellow = topFace[r * 3 + c] === 1;
      rects.push(
        <rect
          key={`t${r}${c}`}
          x={x + 1} y={y + 1}
          width={cellSize - 2} height={cellSize - 2}
          fill={isYellow ? yellow : gray}
          rx={3}
          stroke={border}
          strokeWidth={0.5}
        />
      );
    }
  }

  return (
    <svg
      width={totalSize} height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      style={{ flexShrink: 0 }}
    >
      <rect width={totalSize} height={totalSize} fill={bg} rx={8} />
      {rects}
      <rect
        x={ox + padding} y={oy + padding}
        width={cellSize * 3} height={cellSize * 3}
        fill="none" stroke={border} strokeWidth={2} rx={2}
      />
    </svg>
  );
}
