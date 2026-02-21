import CubeSVG from './CubeSVG';
import PllSVG from './PllSVG';

export default function AlgorithmCard({ caseData, isPll, isLearned, onToggle, expanded, onExpand }) {

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

  return (
    <div
      onClick={onExpand}
      className="fade-in"
      style={{
        background: isLearned
          ? 'linear-gradient(135deg, #081f0c 0%, #0e2a14 100%)'
          : 'var(--bg-card)',
        border: `1px solid ${isLearned ? 'var(--green-border)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        ...(isLearned && { boxShadow: '0 0 20px rgba(34, 197, 94, 0.06)' })
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isLearned ? '#2d8a4d' : 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isLearned
          ? '0 4px 24px rgba(34,197,94,0.12)'
          : '0 4px 24px rgba(255,215,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isLearned ? 'var(--green-border)' : 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isLearned ? '0 0 20px rgba(34,197,94,0.06)' : 'none';
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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: expanded ? 14 : 0 }}>
        {renderSvg()}
        <div>
          <div style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: isLearned ? '#4ade80' : 'var(--text-primary)',
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
              background: isLearned ? '#071a0a' : 'var(--bg-input)',
              border: `1px solid ${isLearned ? '#142e1a' : 'var(--border)'}`,
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

          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            style={{
              width: '100%',
              marginTop: 10,
              padding: '11px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.02em',
              background: isLearned
                ? 'linear-gradient(135deg, var(--red), var(--red-dark))'
                : 'linear-gradient(135deg, var(--green), var(--green-dark))',
              color: '#fff',
              transition: 'all 0.2s',
              boxShadow: isLearned
                ? '0 2px 12px rgba(239,68,68,0.2)'
                : '0 2px 12px rgba(34,197,94,0.2)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLearned ? '✗  Quitar de aprendidos' : '✓  Marcar como aprendido'}
          </button>
        </div>
      )}
    </div>
  );
}