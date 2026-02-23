import { formatSolveTime } from '../../utils/timeFormat';

export default function SolveModal({ solve, solveIndex, onClose, onPenalty, onDelete }) {
  if (!solve) return null;

  const handleCopy = () => {
    const text = `${formatSolveTime(solve)} - ${solve.scramble}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleDelete = () => {
    if (window.confirm('¿Eliminar este solve?')) {
      onDelete(solve.id);
    }
  };

  const dateStr = new Date(solve.date).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const btnBase = {
    padding: '10px 16px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.82rem',
    background: 'var(--bg-input)',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s',
    flex: 1,
    minWidth: 0,
    textAlign: 'center'
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '28px 24px',
          width: '100%',
          maxWidth: 380,
          animation: 'fadeIn 0.2s ease'
        }}
      >
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          marginBottom: 4
        }}>
          Solve #{solveIndex}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: solve.penalty === 'DNF' ? 'var(--red)' : 'var(--accent)',
          marginBottom: 16,
          letterSpacing: '-0.02em'
        }}>
          {formatSolveTime(solve)}
        </div>

        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 12
        }}>
          <div style={{
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700,
            marginBottom: 4
          }}>Scramble</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            wordBreak: 'break-word'
          }}>{solve.scramble}</div>
        </div>

        <div style={{
          display: 'flex',
          gap: 12,
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: 18,
          fontWeight: 500
        }}>
          <span>{dateStr}</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            background: 'var(--bg-secondary)',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: '0.7rem'
          }}>{solve.puzzle}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => onPenalty(solve.id, solve.penalty === '+2' ? null : '+2')}
            style={{
              ...btnBase,
              background: solve.penalty === '+2' ? 'var(--accent)' : btnBase.background,
              color: solve.penalty === '+2' ? '#000' : btnBase.color,
              borderColor: solve.penalty === '+2' ? 'var(--accent)' : 'var(--border)'
            }}
          >+2</button>
          <button
            onClick={() => onPenalty(solve.id, solve.penalty === 'DNF' ? null : 'DNF')}
            style={{
              ...btnBase,
              background: solve.penalty === 'DNF' ? 'var(--red)' : btnBase.background,
              color: solve.penalty === 'DNF' ? '#fff' : btnBase.color,
              borderColor: solve.penalty === 'DNF' ? 'var(--red)' : 'var(--border)'
            }}
          >DNF</button>
          <button onClick={handleCopy} style={btnBase}>Copiar</button>
        </div>

        <button
          onClick={handleDelete}
          style={{
            ...btnBase,
            width: '100%',
            flex: 'none',
            color: 'var(--red)',
            borderColor: 'var(--red)',
            background: 'transparent',
            marginBottom: 10
          }}
        >Eliminar</button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            transition: 'all 0.2s'
          }}
        >Done</button>
      </div>
    </div>
  );
}
