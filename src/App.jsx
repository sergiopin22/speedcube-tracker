import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import OLL20Logo from './components/OLL20Logo';
import InstallPrompt from './components/InstallPrompt';

const LOADING_MIN_MS = 700;

export default function App() {
  const { user, loading } = useAuth();
  const { isLight } = useTheme();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), LOADING_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  const showLoading = loading || !minTimeElapsed;
  const isFullscreenView = showLoading || !user;

  useEffect(() => {
    if (isFullscreenView) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('app-fullscreen-view');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('app-fullscreen-view');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('app-fullscreen-view');
    };
  }, [isFullscreenView]);

  if (showLoading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        height: '100vh',
        width: '100vw',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      }}>
        <div style={{ animation: 'pulse 1.5s infinite' }}>
          <OLL20Logo size={56} yellow="#FFEB3B" white="#fff" cellBorder={isLight} />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando...</p>
      </div>
    );
  }

  return user ? (
    <>
      <Dashboard />
      <InstallPrompt />
    </>
  ) : <LoginPage />;
}
