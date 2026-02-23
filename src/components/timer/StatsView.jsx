import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getSessionStats, formatAvg } from '../../utils/stats';
import { formatTime, getEffectiveTime } from '../../utils/timeFormat';

function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '14px 16px',
      textAlign: 'center',
      flex: 1,
      minWidth: 100
    }}>
      <div style={{
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 700,
        marginBottom: 6
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '1.1rem',
        fontWeight: 800,
        color: value === '-' || value === 'DNF' ? 'var(--text-muted)' : 'var(--text-primary)'
      }}>{value}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: '0.78rem',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: 2 }}>#{label}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatTime(payload[0].value)}</div>
    </div>
  );
}

export default function StatsView({ solves }) {
  const stats = useMemo(() => getSessionStats(solves), [solves]);

  const lineData = useMemo(() => {
    return [...solves].reverse().map((s, i) => ({
      idx: i + 1,
      time: getEffectiveTime(s) === Infinity ? null : getEffectiveTime(s)
    })).filter(d => d.time !== null);
  }, [solves]);

  const histogramData = useMemo(() => {
    const validTimes = solves
      .map(s => getEffectiveTime(s))
      .filter(t => t !== Infinity);

    if (validTimes.length === 0) return [];

    const min = Math.min(...validTimes);
    const max = Math.max(...validTimes);
    const range = max - min;
    const bucketSize = range < 5000 ? 1000 : range < 20000 ? 2000 : 5000;
    const bucketStart = Math.floor(min / bucketSize) * bucketSize;
    const buckets = {};

    for (const t of validTimes) {
      const key = Math.floor(t / bucketSize) * bucketSize;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const result = [];
    for (let k = bucketStart; k <= max; k += bucketSize) {
      result.push({
        range: formatTime(k),
        count: buckets[k] || 0
      });
    }
    return result;
  }, [solves]);

  const handleExport = () => {
    const data = JSON.stringify(solves, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speedcube-solves-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (solves.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>⏱️</div>
        <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>
          No hay solves todavía
        </p>
        <p style={{ fontSize: '0.8rem', fontWeight: 400 }}>
          Haz tu primer solve para ver estadísticas
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <StatCard label="Total" value={solves.length} />
        <StatCard label="Mejor" value={stats.bestSingle ? formatTime(stats.bestSingle) : '-'} />
        <StatCard label="Ao5" value={formatAvg(stats.currentAo5)} />
        <StatCard label="Ao12" value={formatAvg(stats.currentAo12)} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <StatCard label="Mejor Ao5" value={formatAvg(stats.bestAo5)} />
        <StatCard label="Mejor Ao12" value={formatAvg(stats.bestAo12)} />
      </div>

      {/* Line chart */}
      {lineData.length > 1 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 12px 10px'
        }}>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: 14,
            paddingLeft: 8
          }}>Tiempos</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="idx"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => formatTime(v)}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="time"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: lineData.length > 50 ? 0 : 3, fill: 'var(--accent)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Histogram */}
      {histogramData.length > 1 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 12px 10px'
        }}>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: 14,
            paddingLeft: 8
          }}>Distribución</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                allowDecimals={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: '0.78rem'
                }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--text-secondary)',
          fontWeight: 700,
          fontSize: '0.82rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--accent)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        Exportar solves como JSON
      </button>
    </div>
  );
}
