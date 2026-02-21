export default function ProgressBar({ learned, total, label }) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {learned}/{total}
          <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>({pct}%)</span>
        </span>
      </div>
      <div style={{
        height: 8,
        background: 'var(--bg-secondary)',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: pct === 100
            ? 'linear-gradient(90deg, var(--accent), #ff8c00)'
            : 'linear-gradient(90deg, var(--green), var(--green-dark))',
          borderRadius: 10,
          transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: pct === 100 ? '0 0 12px rgba(255,215,0,0.4)' : '0 0 8px rgba(34,197,94,0.3)'
        }} />
      </div>
    </div>
  );
}
