import { useState, useEffect, useCallback, useRef } from 'react';
import db from '../db/index.js';
import { generateScramble } from '../utils/scramble';
import { formatTime } from '../utils/timeFormat';
import { getSessionStats, formatAvg } from '../utils/stats';
import Header from '../components/Header';
import ScrambleDisplay from '../components/timer/ScrambleDisplay';
import TimerDisplay from '../components/timer/TimerDisplay';
import TimerNav from '../components/timer/TimerNav';
import TimesList from '../components/timer/TimesList';
import StatsView from '../components/timer/StatsView';

export default function TimerPage({ activePage, onPageChange, userId }) {
  const [activeTab, setActiveTab] = useState('timer');
  const [scramble, setScramble] = useState(() => generateScramble());
  const [solves, setSolves] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [lastSolveId, setLastSolveId] = useState(null);
  const scrambleRef = useRef(scramble);
  const sessionKey = `speedcube-timer-session-${userId}`;

  useEffect(() => {
    if (activeTab === 'timer') {
      document.body.classList.add('timer-active');
    } else {
      document.body.classList.remove('timer-active');
    }
    return () => document.body.classList.remove('timer-active');
  }, [activeTab]);

  useEffect(() => { scrambleRef.current = scramble; }, [scramble]);

  // Init or restore session per user
  useEffect(() => {
    if (!userId) return;
    (async () => {
      let sid = null;
      try {
        const stored = localStorage.getItem(sessionKey);
        if (stored) sid = parseInt(stored, 10);
      } catch {}

      if (sid) {
        const session = await db.sessions.get(sid);
        if (session && session.userId === userId) {
          setSessionId(sid);
          const sessionSolves = await db.solves
            .where('sessionId').equals(sid)
            .reverse()
            .sortBy('date');
          setSolves(sessionSolves.sort((a, b) => b.date - a.date));
          return;
        }
      }

      const newId = await db.sessions.add({
        name: 'Session ' + new Date().toLocaleDateString('es-ES'),
        puzzle: '3x3',
        createdAt: Date.now(),
        userId
      });
      setSessionId(newId);
      setSolves([]);
      setLastSolveId(null);
      try { localStorage.setItem(sessionKey, String(newId)); } catch {}
    })();
  }, [userId, sessionKey]);

  const refreshSolves = useCallback(async () => {
    if (!sessionId) return;
    const sessionSolves = await db.solves
      .where('sessionId').equals(sessionId)
      .toArray();
    setSolves(sessionSolves.sort((a, b) => b.date - a.date));
  }, [sessionId]);

  const handleSolveComplete = useCallback(async (timeMs) => {
    if (!sessionId) return;

    const id = await db.solves.add({
      puzzle: '3x3',
      time: timeMs,
      date: Date.now(),
      sessionId,
      scramble: scrambleRef.current,
      penalty: null,
      comment: ''
    });

    setLastSolveId(id);
    setScramble(generateScramble());
    await refreshSolves();
  }, [sessionId, refreshSolves]);

  const handlePenalty = useCallback(async (solveId, penalty) => {
    await db.solves.update(solveId, { penalty });
    await refreshSolves();
  }, [refreshSolves]);

  const handleDelete = useCallback(async (solveId) => {
    await db.solves.delete(solveId);
    if (lastSolveId === solveId) setLastSolveId(null);
    await refreshSolves();
  }, [refreshSolves, lastSolveId]);

  const handleQuickPenalty = useCallback(async (penalty) => {
    if (!lastSolveId) return;
    const solve = await db.solves.get(lastSolveId);
    if (!solve) return;
    const newPenalty = solve.penalty === penalty ? null : penalty;
    await db.solves.update(lastSolveId, { penalty: newPenalty });
    await refreshSolves();
  }, [lastSolveId, refreshSolves]);

  const stats = getSessionStats(solves);
  const lastSolve = solves.length > 0 ? solves[0] : null;

  const penaltyBtnStyle = (active) => ({
    padding: '8px 18px',
    borderRadius: 10,
    border: active ? 'none' : '1px solid var(--border)',
    fontWeight: 700,
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-mono)'
  });

  return (
    <div className="timer-page-root" style={{ background: 'var(--bg-primary)' }}>
      <Header activePage={activePage} onPageChange={onPageChange} />
      <main className="timer-main" style={{
        width: '94%',
        margin: '0 auto'
      }}>
        {/* Top nav (desktop) */}
        <div className="timer-nav-top" style={{ marginBottom: 16 }}>
          <TimerNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'timer' && (
          <div className="timer-tab-layout">
            {/* Left / main column: scramble + timer + penalties */}
            <div className="timer-tab-main">
              <ScrambleDisplay scramble={scramble} />
              <TimerDisplay
                onSolveComplete={handleSolveComplete}
                disabled={activeTab !== 'timer'}
              />

              {lastSolve && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  marginTop: 8,
                  marginBottom: 12
                }}>
                  <button
                    onClick={() => handleQuickPenalty('+2')}
                    style={{
                      ...penaltyBtnStyle(lastSolve.penalty === '+2'),
                      background: lastSolve.penalty === '+2' ? 'var(--accent)' : 'var(--bg-card)',
                      color: lastSolve.penalty === '+2' ? '#000' : 'var(--text-secondary)'
                    }}
                  >+2</button>
                  <button
                    onClick={() => handleQuickPenalty('DNF')}
                    style={{
                      ...penaltyBtnStyle(lastSolve.penalty === 'DNF'),
                      background: lastSolve.penalty === 'DNF' ? 'var(--red)' : 'var(--bg-card)',
                      color: lastSolve.penalty === 'DNF' ? '#fff' : 'var(--text-secondary)'
                    }}
                  >DNF</button>
                </div>
              )}
            </div>

            {/* Right column on desktop / below on mobile: live stats */}
            {solves.length > 0 && (
              <div className="timer-tab-stats" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '14px 18px'
              }}>
                <div className="timer-live-stats">
                  {[
                    { label: 'Single', value: lastSolve ? formatTime(lastSolve.penalty === '+2' ? lastSolve.time + 2000 : lastSolve.penalty === 'DNF' ? null : lastSolve.time) : '-' },
                    { label: 'Ao5', value: formatAvg(stats.currentAo5) },
                    { label: 'Ao12', value: formatAvg(stats.currentAo12) },
                    { label: 'Mejor', value: stats.bestSingle ? formatTime(stats.bestSingle) : '-' },
                    { label: 'Mejor Ao5', value: formatAvg(stats.bestAo5) },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{
                        fontSize: '0.58rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 700,
                        marginBottom: 4
                      }}>{s.label}</div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: s.value === '-' || s.value === 'DNF' ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'times' && (
          <TimesList
            solves={solves}
            onPenalty={handlePenalty}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView solves={solves} />
        )}
      </main>

      {/* Bottom nav (mobile) */}
      <div className="timer-nav-bottom" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        zIndex: 50
      }}>
        <TimerNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
