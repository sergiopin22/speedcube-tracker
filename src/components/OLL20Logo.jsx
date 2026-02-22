/**
 * Logo: OLL 20 top face — 2x2 amarillo arriba-izquierda, resto blanco.
 * Patrón fijo, sin dependencias de datos.
 */
const OLL20_TOP = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 0]
];

export default function OLL20Logo({ size = 36, yellow = '#FFEB3B', white = '#fff', cellBorder = false }) {
  const pad = size * 0.06;
  const cell = (size - pad * 4) / 3;
  const r = Math.max(1, cell * 0.15);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      {OLL20_TOP.flatMap((row, i) =>
        row.map((v, j) => (
          <rect
            key={`${i}-${j}`}
            x={pad + j * (cell + pad)}
            y={pad + i * (cell + pad)}
            width={cell}
            height={cell}
            rx={r}
            fill={v ? yellow : white}
            {...(cellBorder && { stroke: 'rgba(0,0,0,1)', strokeWidth: 1 })}
          />
        ))
      )}
    </svg>
  );
}
