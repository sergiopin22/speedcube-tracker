import useInstallPrompt from '../hooks/useInstallPrompt';

export default function InstallPrompt() {
  const { shouldShow, canInstall, isIOS, install, dismiss } = useInstallPrompt();

  if (!shouldShow) return null;
  if (!canInstall && !isIOS) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.banner}>
        <div style={styles.content}>
          <p style={styles.title}>
            {canInstall
              ? 'Instala SpeedCube Tracker'
              : 'Añade SpeedCube Tracker'}
          </p>
          <p style={styles.subtitle}>
            {canInstall
              ? 'Accede más rápido y sin barra del navegador.'
              : 'En Safari, toca el botón Compartir y luego "Añadir a la pantalla de inicio".'}
          </p>
        </div>

        <div style={styles.actions}>
          {canInstall && (
            <button style={styles.installBtn} onClick={install}>
              Instalar
            </button>
          )}
          <button style={styles.dismissBtn} onClick={dismiss}>
            {canInstall ? 'Ahora no' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: '12px',
    pointerEvents: 'none',
  },
  banner: {
    pointerEvents: 'auto',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
    fontFamily: 'var(--font-display)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 400,
    margin: 0,
    lineHeight: 1.4,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  installBtn: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'var(--accent)',
    color: '#0c0c14',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  dismissBtn: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
};
