const TABS = [
  { id: 'timer', label: 'Timer', icon: '⏱' },
  { id: 'times', label: 'Tiempos', icon: '📋' },
  { id: 'stats', label: 'Stats', icon: '📊' }
];

export default function TimerNav({ activeTab, onTabChange }) {
  return (
    <nav className="timer-nav" style={{
      display: 'flex',
      gap: 4,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 4
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 10,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              background: active ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))' : 'transparent',
              color: active ? '#000' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span className="timer-nav-icon">{tab.icon}</span>
            <span className="timer-nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
