import CubeSVG from './CubeSVG';
import PllSVG from './PllSVG';

export default function AlgorithmCard({ caseData, isPll, isLearned, isLearning, onToggle, onToggleLearning, expanded, onExpand }) {

  const renderSvg = () => {
    if (caseData.svg) {
      return (
        <div
          style={{ width: 72, height: 72, flexShrink: 0 }}
          dangerouslySetInnerHTML={{ __html: caseData.svg.replace(/width="75"/, 'width="72"').replace(/height="75"/, 'height="72"') }}
        />
      );
    }
    if (isPll) return <PllSVG size={72} learned={isLearned} />;
    return <CubeSVG topFace={caseData.top} sides={caseData.sides} size={72} learned={isLearned} />;
  };

  const cardIsLearning = isLearning && !isLearned;
  const cardStyle = {
    background: isLearned
      ? 'linear-gradient(135deg, #081f0c 0%, #0e2a14 100%)'
      : cardIsLearning
        ? 'linear-gradient(135deg, #0a1628 0%, #0e1e36 100%)'
        : 'var(--bg-card)',
    border: `1px solid ${isLearned ? 'var(--green-border)' : cardIsLearning ? 'var(--blue-border)' : 'var(--border)'}`,
    borderRadius: 16,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    position: 'relative',
    overflow: 'hidden',
    ...(isLearned && { boxShadow: '0 0 20px rgba(34, 197, 94, 0.06)' }),
    ...(cardIsLearning && { boxShadow: '0 0 20px rgba(59, 130, 246, 0.08)' })
  };
  const hoverBorder = isLearned ? '#2d8a4d' : cardIsLearning ? '#3b82f6' : 'var(--accent)';
  const hoverShadow = isLearned ? '0 4px 24px rgba(34,197,94,0.12)' : cardIsLearning ? '0 4px 24px rgba(59,130,246,0.15)' : '0 4px 24px rgba(255,215,0,0.08)';
  const leaveBorder = isLearned ? 'var(--green-border)' : cardIsLearning ? 'var(--blue-border)' : 'var(--border)';
  const leaveShadow = isLearned ? '0 0 20px rgba(34,197,94,0.06)' : cardIsLearning ? '0 0 20px rgba(59,130,246,0.08)' : 'none';

  return (
    <div
      onClick={onExpand}
      className="fade-in"
      style={cardStyle}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = hoverShadow;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = leaveBorder;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = leaveShadow;
      }}
    >
      {/* Learned badge */}
      {isLearned && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
          borderRadius: '50%',
          width: 26, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: '#fff', fontWeight: 800,
          boxShadow: '0 2px 8px rgba(34,197,94,0.3)'
        }}>✓</div>
      )}
      {/* Learning badge */}
      {cardIsLearning && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'linear-gradient(135deg, var(--blue), var(--blue-dark))',
          borderRadius: '50%',
          width: 26, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: '#fff', fontWeight: 800,
          boxShadow: '0 2px 8px rgba(59,130,246,0.4)'
        }}>⋯</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: expanded ? 14 : 0 }}>
        {renderSvg()}
        <div>
          <div style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: isLearned ? '#4ade80' : cardIsLearning ? '#93c5fd' : 'var(--text-primary)',
            letterSpacing: '0.01em'
          }}>
            {caseData.name}
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginTop: 3,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600
          }}>
            {caseData.category}
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          fontSize: 12,
          color: 'var(--text-muted)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s'
        }}>▼</div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {/* Setup move (OLL y PLL) */}
          {caseData.setup && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              background: '#1a1a2e',
              border: '1px solid #2a2a4a',
              padding: '9px 12px',
              borderRadius: 10,
              marginBottom: 10,
              color: '#a78bfa',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}>
              <span style={{
                fontSize: '0.55rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 3,
                letterSpacing: '0.12em',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>setup</span>
              {caseData.setup}
            </div>
          )}

          {caseData.algorithms.map((alg, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.73rem',
              background: isLearned ? '#071a0a' : cardIsLearning ? '#0a1628' : 'var(--bg-input)',
              border: `1px solid ${isLearned ? '#142e1a' : cardIsLearning ? '#1e3a5f' : 'var(--border)'}`,
              padding: '9px 12px',
              borderRadius: 10,
              marginBottom: 7,
              color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)',
              lineHeight: 1.5,
              wordBreak: 'break-word',
              position: 'relative'
            }}>
              {i === 0 && (
                <span style={{
                  fontSize: '0.55rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: 3,
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>estándar</span>
              )}
              {alg}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {isLearned ? (
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.02em',
                  background: 'linear-gradient(135deg, var(--red), var(--red-dark))',
                  color: '#fff',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 12px rgba(239,68,68,0.2)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✗  Quitar de aprendidos
              </button>
            ) : cardIsLearning ? (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.02em',
                    background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
                    color: '#fff',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 12px rgba(34,197,94,0.2)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ✓  Marcar como aprendido
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLearning(); }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    letterSpacing: '0.02em',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  Ya no lo estoy aprendiendo
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLearning(); }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.02em',
                    background: 'linear-gradient(135deg, var(--blue), var(--blue-dark))',
                    color: '#fff',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 12px rgba(59,130,246,0.3)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📖  Me lo estoy aprendiendo
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.02em',
                    background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
                    color: '#fff',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 12px rgba(34,197,94,0.2)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ✓  Marcar como aprendido
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}