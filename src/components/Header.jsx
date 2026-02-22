import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme, isLight } = useTheme();

  const headerStyle = isLight
    ? {
        background: '#000',
        borderBottom: '1px solid #222',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    : {
        background: 'var(--header-bg)',
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
      };

  const trackerColor = isLight ? '#fff' : 'var(--text-secondary)';
  const emailColor = isLight ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)';

  const themeButtonStyle = isLight
    ? {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 10,
        color: '#000',
        padding: '7px 14px',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: 600,
        transition: 'all 0.2s'
      }
    : {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        color: 'var(--text-secondary)',
        padding: '7px 14px',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: 600,
        transition: 'all 0.2s'
      };

  const logoutButtonStyle = isLight
    ? {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 10,
        color: '#000',
        padding: '7px 16px',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: 600,
        transition: 'all 0.2s'
      }
    : {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        color: 'var(--text-secondary)',
        padding: '7px 16px',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: 600,
        transition: 'all 0.2s'
      };

  return (
    <header style={headerStyle}>
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
            color: trackerColor,
            marginLeft: 4
          }}>Tracker</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggleTheme}
          style={themeButtonStyle}
          onMouseEnter={e => {
            if (isLight) {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.borderColor = '#ccc';
            } else {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={e => {
            if (isLight) {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#ddd';
            } else {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>
        {user && (
          <span style={{
            fontSize: '0.7rem',
            color: emailColor,
            display: 'none',
            '@media (min-width: 640px)': { display: 'block' }
          }}>
            {user.email}
          </span>
        )}
        <button
          onClick={logout}
          style={logoutButtonStyle}
          onMouseEnter={e => {
            if (isLight) {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.borderColor = '#ccc';
            } else {
              e.currentTarget.style.borderColor = 'var(--red)';
              e.currentTarget.style.color = 'var(--red)';
            }
          }}
          onMouseLeave={e => {
            if (isLight) {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#ddd';
            } else {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
