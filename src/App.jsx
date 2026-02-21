import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ fontSize: 48, animation: 'pulse 1.5s infinite' }}>🧊</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando...</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginPage />;
}
