import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme, isLight } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

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
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        isolation: 'isolate'
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
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        isolation: 'isolate'
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

  const menuBtnColor = isLight ? '#fff' : 'var(--text-primary)';
  const mobileMenuBg = isLight ? '#000' : 'var(--bg-card)';
  const mobileMenuBorder = isLight ? '#222' : 'var(--border)';

  const renderThemeButton = (isMobile) => (
    <button
      onClick={() => { toggleTheme(); if (isMobile) setMenuOpen(false); }}
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
  );

  const renderLogoutButton = (isMobile) => (
    <button
      onClick={() => { logout(); if (isMobile) setMenuOpen(false); }}
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
  );

  return (
    <header style={headerStyle} ref={menuRef}>
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

      <div className="header-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {renderThemeButton(false)}
        {user && (
          <span className="header-email-desktop" style={{ fontSize: '0.7rem', color: emailColor }}>
            {user.email}
          </span>
        )}
        {renderLogoutButton(false)}
      </div>

      <button
        type="button"
        className="header-menu-btn"
        onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          padding: 0,
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          background: 'transparent',
          color: menuBtnColor,
          flexDirection: 'column',
          gap: 5
        }}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span style={{ width: 20, height: 2, background: 'currentColor', borderRadius: 1, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <span style={{ width: 20, height: 2, background: 'currentColor', borderRadius: 1, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 20, height: 2, background: 'currentColor', borderRadius: 1, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
      </button>

      {menuOpen && (
        <div
          className="header-mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: mobileMenuBg,
            borderBottom: `1px solid ${mobileMenuBorder}`,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          {user && (
            <span style={{ fontSize: '0.8rem', color: emailColor, marginBottom: 4 }}>
              {user.email}
            </span>
          )}
          {renderThemeButton(true)}
          {renderLogoutButton(true)}
        </div>
      )}
    </header>
  );
}
