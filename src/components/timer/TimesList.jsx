import { useState } from 'react';
import { formatSolveTime } from '../../utils/timeFormat';
import SolveModal from './SolveModal';

export default function TimesList({ solves, onPenalty, onDelete }) {
  const [selectedSolve, setSelectedSolve] = useState(null);

  const totalCount = solves.length;

  return (
    <div>
      {selectedSolve && (
        <SolveModal
          solve={selectedSolve.solve}
          solveIndex={selectedSolve.index}
          onClose={() => setSelectedSolve(null)}
          onPenalty={(id, penalty) => {
            onPenalty(id, penalty);
            setSelectedSolve(prev => prev ? {
              ...prev,
              solve: { ...prev.solve, penalty }
            } : null);
          }}
          onDelete={(id) => {
            onDelete(id);
            setSelectedSolve(null);
          }}
        />
      )}

      <div style={{
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12,
        padding: '0 4px'
      }}>
        {totalCount} solve{totalCount !== 1 ? 's' : ''}
      </div>

      {solves.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          No hay solves en esta sesión
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          maxHeight: 'calc(100vh - 220px)',
          overflowY: 'auto',
          paddingRight: 4
        }}>
          {solves.map((solve, i) => {
            const index = totalCount - i;
            const isDNF = solve.penalty === 'DNF';
            const isPlus2 = solve.penalty === '+2';

            return (
              <div
                key={solve.id}
                onClick={() => setSelectedSolve({ solve, index })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  minWidth: 28,
                  textAlign: 'right'
                }}>
                  {index}.
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: isDNF ? 'var(--red)' : 'var(--text-primary)',
                  flex: 1
                }}>
                  {formatSolveTime(solve)}
                </span>
                {(isDNF || isPlus2) && (
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: isDNF ? 'rgba(239,68,68,0.15)' : 'rgba(255,215,0,0.15)',
                    color: isDNF ? 'var(--red)' : 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {solve.penalty}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
