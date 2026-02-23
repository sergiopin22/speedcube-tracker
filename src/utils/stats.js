import { getEffectiveTime, formatTime } from './timeFormat';

export function calcAoN(solves, n) {
  if (solves.length < n) return null;

  const last = solves.slice(0, n);
  const times = last.map(s => getEffectiveTime(s));
  const dnfCount = times.filter(t => t === Infinity).length;

  // More than 1 DNF means the average is DNF
  if (dnfCount > 1) return Infinity;

  const sorted = [...times].sort((a, b) => a - b);
  // Remove best (first) and worst (last)
  const trimmed = sorted.slice(1, -1);

  if (trimmed.some(t => t === Infinity)) return Infinity;

  const sum = trimmed.reduce((acc, t) => acc + t, 0);
  return sum / trimmed.length;
}

export function formatAvg(val) {
  if (val === null || val === undefined) return '-';
  if (val === Infinity) return 'DNF';
  return formatTime(val);
}

export function getBestSingle(solves) {
  if (solves.length === 0) return null;
  let best = Infinity;
  for (const s of solves) {
    const t = getEffectiveTime(s);
    if (t < best) best = t;
  }
  return best === Infinity ? null : best;
}

export function getBestAoN(solves, n) {
  if (solves.length < n) return null;
  let best = Infinity;
  for (let i = 0; i <= solves.length - n; i++) {
    const subset = solves.slice(i, i + n);
    const times = subset.map(s => getEffectiveTime(s));
    const dnfCount = times.filter(t => t === Infinity).length;
    if (dnfCount > 1) continue;

    const sorted = [...times].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, -1);
    if (trimmed.some(t => t === Infinity)) continue;

    const avg = trimmed.reduce((acc, t) => acc + t, 0) / trimmed.length;
    if (avg < best) best = avg;
  }
  return best === Infinity ? null : best;
}

export function getSessionStats(solves) {
  const currentAo5 = calcAoN(solves, 5);
  const currentAo12 = calcAoN(solves, 12);
  const bestSingle = getBestSingle(solves);
  const bestAo5 = getBestAoN(solves, 5);
  const bestAo12 = getBestAoN(solves, 12);

  return { currentAo5, currentAo12, bestSingle, bestAo5, bestAo12 };
}
