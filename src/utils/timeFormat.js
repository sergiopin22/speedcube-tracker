export function formatTime(ms) {
  if (ms === null || ms === undefined || ms < 0) return '-';

  const totalSeconds = ms / 1000;

  if (totalSeconds < 60) {
    return totalSeconds.toFixed(2);
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2).padStart(5, '0');
  return `${minutes}:${seconds}`;
}

export function formatSolveTime(solve) {
  if (!solve) return '-';
  if (solve.penalty === 'DNF') return 'DNF';

  const time = solve.penalty === '+2' ? solve.time + 2000 : solve.time;
  const formatted = formatTime(time);
  return solve.penalty === '+2' ? `${formatted}+` : formatted;
}

export function getEffectiveTime(solve) {
  if (!solve) return Infinity;
  if (solve.penalty === 'DNF') return Infinity;
  return solve.penalty === '+2' ? solve.time + 2000 : solve.time;
}
