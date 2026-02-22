import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import OLL20Logo from '../components/OLL20Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const { isLight } = useTheme();

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const existingEmail = err.customData?.email || '';
        if (existingEmail) setEmail(existingEmail);
        setError('Ese correo ya está registrado con contraseña. Inicia sesión con tu contraseña.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('');
      } else {
        setError(err.message || 'Error al iniciar sesión con Google');
      }
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Credenciales incorrectas'
          : err.code === 'auth/too-many-requests'
          ? 'Demasiados intentos. Intenta más tarde'
          : 'Error al iniciar sesión'
      );
    }
    setLoading(false);
  }

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
      padding: 20,
      overflow: 'hidden',
      boxSizing: 'border-box',
      margin: 0
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)',
        top: '20%', left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="fade-in" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '44px 36px',
        width: '100%',
        maxWidth: 400,
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        textAlign: 'center',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
          <OLL20Logo size={56} yellow="#FFEB3B" white="#fff" cellBorder={isLight} />
        </div>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 900,
          marginBottom: 4,
          background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>SpeedCube Tracker</h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginBottom: 32,
          fontWeight: 500
        }}>Controla tu progreso OLL & PLL</p>

        <div style={{ textAlign: 'left' }}>
          <label style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            display: 'block',
            marginBottom: 5,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: '100%',
              padding: '13px 16px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              marginBottom: 16,
              boxSizing: 'border-box',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.2s'
            }}
          />

          <label style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            display: 'block',
            marginBottom: 5,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '13px 16px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              marginBottom: 24,
              boxSizing: 'border-box',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.2s'
            }}
          />
        </div>

        {error && (
          <p style={{
            color: 'var(--red)',
            fontSize: '0.82rem',
            marginBottom: 14,
            fontWeight: 600
          }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            color: '#000',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: loading ? 'wait' : 'pointer',
            letterSpacing: '0.01em',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          margin: '20px 0 12px',
          fontWeight: 500
        }}>o</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
