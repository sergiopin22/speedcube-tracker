const FACES = ['U', 'D', 'R', 'L', 'F', 'B'];
const MODIFIERS = ['', "'", '2'];
const OPPOSITE = { U: 'D', D: 'U', R: 'L', L: 'R', F: 'B', B: 'F' };

export function generateScramble(length = 20) {
  const moves = [];
  let lastFace = null;
  let secondLastFace = null;

  while (moves.length < length) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];

    if (face === lastFace) continue;
    // Avoid sequences like U D U (same axis, redundant)
    if (face === secondLastFace && OPPOSITE[face] === lastFace) continue;

    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    moves.push(face + modifier);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves.join(' ');
}
