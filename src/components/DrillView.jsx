import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import CubeSVG from './CubeSVG';
import PllSVG from './PllSVG';

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function playStreakSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 523;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.14);
  } catch (_) {}
}

const DRILL_FILTERS = [
  { id: 'learned', label: 'Casos que me sé' },
  { id: 'learning', label: 'Estoy aprendiendo' },
  { id: 'all', label: 'Todos' }
];

function renderCaseImage(caseData, isPll, size = 160) {
  if (caseData.svg) {
    const svg = caseData.svg
      .replace(/width="75"/, `width="${size}"`)
      .replace(/height="75"/, `height="${size}"`);
    return (
      <div
        style={{ width: size, height: size, flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  if (isPll) return <PllSVG size={size} learned={false} />;
  return (
    <CubeSVG
      topFace={caseData.top}
      sides={caseData.sides}
      size={size}
      learned={false}
    />
  );
}

export default function DrillView({ drillType, cases, progress }) {
  const isPll = drillType === 'pll';
  const learned = isPll ? progress.pll : progress.oll;
  const learning = isPll ? (progress.pllLearning || {}) : (progress.ollLearning || {});

  const pool = useMemo(() => {
    const learnedIds = Object.keys(learned);
    const learningIds = Object.keys(learning);
    return cases.filter(c => learnedIds.includes(String(c.id)) || learningIds.includes(String(c.id)));
  }, [cases, learned, learning]);

  const [drillFilter, setDrillFilter] = useState('all');
  const [currentCase, setCurrentCase] = useState(null);
  const [algorithmRevealed, setAlgorithmRevealed] = useState(false);
  const sessionKey = isPll ? 'pll' : 'oll';
  const [sessionStatsByType, setSessionStatsByType] = useState({
    oll: { correct: 0, total: 0 },
    pll: { correct: 0, total: 0 }
  });
  const [sessionWrongIdsByType, setSessionWrongIdsByType] = useState({
    oll: new Set(),
    pll: new Set()
  });
  const [correctStreakByType, setCorrectStreakByType] = useState({ oll: 0, pll: 0 });
  const [today, setToday] = useState(() => getTodayString());
  const lastSessionDateRef = useRef({ oll: null, pll: null });

  const sessionStats = sessionStatsByType[sessionKey];
  const sessionWrongIds = sessionWrongIdsByType[sessionKey];
  const correctStreak = correctStreakByType[sessionKey];

  useEffect(() => {
    const onFocus = () => setToday(getTodayString());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    const key = sessionKey;
    if (lastSessionDateRef.current[key] !== today) {
      lastSessionDateRef.current[key] = today;
      setSessionStatsByType(prev => ({ ...prev, [key]: { correct: 0, total: 0 } }));
      setSessionWrongIdsByType(prev => ({ ...prev, [key]: new Set() }));
      setCorrectStreakByType(prev => ({ ...prev, [key]: 0 }));
    }
  }, [sessionKey, today]);

  useEffect(() => {
    setCurrentCase(null);
    setAlgorithmRevealed(false);
  }, [sessionKey]);

  const filteredPool = useMemo(() => {
    if (drillFilter === 'learned') return pool.filter(c => learned[c.id]);
    if (drillFilter === 'learning') return pool.filter(c => learning[c.id]);
    return pool;
  }, [pool, drillFilter, learned, learning]);

  const pickNextCase = useCallback(() => {
    if (filteredPool.length === 0) {
      setCurrentCase(null);
      setAlgorithmRevealed(false);
      return;
    }
    const wrongInPool = filteredPool.filter(c => sessionWrongIds.has(c.id));
    const fromWrong = wrongInPool.length > 0 && Math.random() < 0.5;
    const source = fromWrong ? wrongInPool : filteredPool;
    const next = source[Math.floor(Math.random() * source.length)];
    setCurrentCase(next);
    setAlgorithmRevealed(false);
  }, [filteredPool, sessionWrongIds]);

  const handleReveal = () => setAlgorithmRevealed(true);

  const handleCorrect = () => {
    setCorrectStreakByType(prev => {
      const next = prev[sessionKey] + 1;
      if (next === 3 || next === 5 || next === 10) playStreakSound();
      return { ...prev, [sessionKey]: next };
    });
    setSessionStatsByType(prev => ({
      ...prev,
      [sessionKey]: { ...prev[sessionKey], total: prev[sessionKey].total + 1, correct: prev[sessionKey].correct + 1 }
    }));
    pickNextCase();
  };

  const handleWrong = () => {
    setCorrectStreakByType(prev => ({ ...prev, [sessionKey]: 0 }));
    if (currentCase) {
      setSessionWrongIdsByType(prev => ({
        ...prev,
        [sessionKey]: new Set([...prev[sessionKey], currentCase.id])
      }));
    }
    setSessionStatsByType(prev => ({
      ...prev,
      [sessionKey]: { ...prev[sessionKey], total: prev[sessionKey].total + 1 }
    }));
    pickNextCase();
  };

  const handleNext = () => pickNextCase();

  if (pool.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        marginTop: 8
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
        <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
          No hay casos para practicar
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Marca casos como aprendidos o &quot;Me lo estoy aprendiendo&quot; en la pestaña {isPll ? 'PLL' : 'OLL'} para usar el drill.
        </p>
      </div>
    );
  }

  if (filteredPool.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '32px 24px',
        marginTop: 8
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 20,
          justifyContent: 'center'
        }}>
          {DRILL_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setDrillFilter(f.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: drillFilter === f.id ? 'none' : '1px solid var(--border)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: drillFilter === f.id ? 'linear-gradient(135deg, var(--blue), var(--blue-dark))' : 'var(--bg-secondary)',
                color: drillFilter === f.id ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          No hay casos con el filtro seleccionado. Prueba otro filtro.
        </p>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '32px 24px',
        marginTop: 8
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 20,
          justifyContent: 'center'
        }}>
          {DRILL_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setDrillFilter(f.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: drillFilter === f.id ? 'none' : '1px solid var(--border)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: drillFilter === f.id ? 'linear-gradient(135deg, var(--blue), var(--blue-dark))' : 'var(--bg-secondary)',
                color: drillFilter === f.id ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
          {filteredPool.length} caso{filteredPool.length !== 1 ? 's' : ''} disponibles
        </p>
        <button
          onClick={pickNextCase}
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '14px 32px',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '1rem',
            background: 'linear-gradient(135deg, var(--accent), #ff8c00)',
            color: '#000',
            transition: 'all 0.2s'
          }}
        >
          Iniciar drill
        </button>
      </div>
    );
  }

  const algText = currentCase.algorithms && currentCase.algorithms[0] ? currentCase.algorithms[0] : '';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '24px 20px',
      marginTop: 8
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
        justifyContent: 'center'
      }}>
        {DRILL_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => { setDrillFilter(f.id); setCurrentCase(null); setAlgorithmRevealed(false); }}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: drillFilter === f.id ? 'none' : '1px solid var(--border)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: drillFilter === f.id ? 'var(--blue)' : 'var(--bg-secondary)',
              color: drillFilter === f.id ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }}>
        {correctStreak >= 3 && (
          <div style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: correctStreak >= 10
              ? 'linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,215,0,0.2))'
              : 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))',
            border: `1px solid ${correctStreak >= 10 ? 'var(--accent)' : 'var(--green-border)'}`,
            fontSize: '0.95rem',
            fontWeight: 800,
            color: correctStreak >= 10 ? 'var(--accent)' : 'var(--green)',
            textAlign: 'center',
            animation: 'streakPop 0.22s ease-out'
          }}>
            {correctStreak >= 10
              ? `¡${correctStreak} seguidos! On fire`
              : correctStreak === 5
                ? '¡En racha! 5 correctos'
                : `¡${correctStreak} seguidos!`}
          </div>
        )}
        <div style={{
          width: '100%',
          maxWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'var(--accent)',
            textAlign: 'center',
            width: '100%'
          }}>
            {currentCase.name}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 140,
            width: '100%'
          }}>
            {renderCaseImage(currentCase, isPll, 140)}
          </div>
        </div>

        {currentCase.setup && (
          <div style={{
            width: '100%',
            maxWidth: 400,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            background: '#1a1a2e',
            border: '1px solid #2a2a4a',
            padding: '12px 16px',
            borderRadius: 12,
            color: '#a78bfa',
            lineHeight: 1.5,
            wordBreak: 'break-word'
          }}>
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: 4,
              letterSpacing: '0.1em',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              Setup (aplica al cubo resuelto)
            </span>
            {currentCase.setup}
          </div>
        )}

        {!algorithmRevealed ? (
          <button
            onClick={handleReveal}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'linear-gradient(135deg, var(--accent), #ff8c00)',
              color: '#000',
              transition: 'all 0.2s'
            }}
          >
            Revelar algoritmo
          </button>
        ) : (
          <>
            <div style={{
              width: '100%',
              maxWidth: 400,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              padding: '12px 16px',
              borderRadius: 12,
              color: 'var(--accent)',
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}>
              {algText}
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              width: '100%',
              maxWidth: 360
            }}>
              <button
                onClick={handleCorrect}
                style={{
                  flex: '1 1 120px',
                  minWidth: 120,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
              >
                ✓ Lo hice bien
              </button>
              <button
                onClick={handleWrong}
                style={{
                  flex: '1 1 120px',
                  minWidth: 120,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, var(--red), var(--red-dark))',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
              >
                ✗ Me equivoqué
              </button>
            </div>
            <button
              onClick={handleNext}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              Siguiente caso
            </button>
          </>
        )}
      </div>

      {sessionStats.total > 0 && (
        <p style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          Sesión {isPll ? 'PLL' : 'OLL'}: {sessionStats.correct}/{sessionStats.total} bien
        </p>
      )}
    </div>
  );
}
