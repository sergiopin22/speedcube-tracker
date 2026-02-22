import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import OLL20Logo from '../components/OLL20Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isLight } = useTheme();

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
      </div>
    </div>
  );
}
