import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header style={{
      background: 'rgba(12, 12, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 26 }}>🧊</span>
        <div>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>SpeedCube</span>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            marginLeft: 4
          }}>Tracker</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user && (
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            display: 'none',
            '@media (min-width: 640px)': { display: 'block' }
          }}>
            {user.email}
          </span>
        )}
        <button
          onClick={logout}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text-secondary)',
            padding: '7px 16px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--red)';
            e.currentTarget.style.color = 'var(--red)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
