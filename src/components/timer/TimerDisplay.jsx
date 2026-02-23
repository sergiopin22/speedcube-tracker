import { useState, useRef, useEffect, useCallback } from 'react';
import { formatTime } from '../../utils/timeFormat';

const HOLD_THRESHOLD = 300;

const STATE_COLORS = {
  idle: 'var(--text-primary)',
  holding: '#ef4444',
  ready: '#22c55e',
  running: 'var(--accent)',
  stopped: 'var(--text-primary)'
};

export default function TimerDisplay({ onSolveComplete, disabled }) {
  const [timerState, setTimerState] = useState('idle');
  const [displayMs, setDisplayMs] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const holdTimerRef = useRef(null);
  const stateRef = useRef('idle');

  // Keep ref in sync for event handlers
  useEffect(() => { stateRef.current = timerState; }, [timerState]);

  const stopTimer = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    cancelAnimationFrame(rafRef.current);
    const finalMs = Math.round(elapsed);
    setDisplayMs(finalMs);
    setTimerState('stopped');
    onSolveComplete(finalMs);
  }, [onSolveComplete]);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setTimerState('running');

    const tick = () => {
      if (stateRef.current !== 'running') return;
      const elapsed = performance.now() - startTimeRef.current;
      setDisplayMs(Math.round(elapsed));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const beginHold = useCallback(() => {
    if (stateRef.current === 'running') {
      stopTimer();
      return;
    }
    if (stateRef.current !== 'idle' && stateRef.current !== 'stopped') return;

    setTimerState('holding');
    holdTimerRef.current = setTimeout(() => {
      setTimerState('ready');
    }, HOLD_THRESHOLD);
  }, [stopTimer]);

  const endHold = useCallback(() => {
    const s = stateRef.current;
    if (s === 'holding') {
      clearTimeout(holdTimerRef.current);
      setTimerState(displayMs > 0 ? 'stopped' : 'idle');
      return;
    }
    if (s === 'ready') {
      setDisplayMs(0);
      startTimer();
    }
  }, [startTimer, displayMs]);

  // Keyboard events
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
      if (e.repeat) return;
      const s = stateRef.current;

      if (s === 'running') {
        e.preventDefault();
        stopTimer();
        return;
      }

      if (e.code === 'Space') {
        beginHold();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        endHold();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, beginHold, endHold, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(holdTimerRef.current);
    };
  }, []);

  const handleTouchStart = (e) => {
    if (disabled) return;
    e.preventDefault();
    beginHold();
  };

  const handleTouchEnd = (e) => {
    if (disabled) return;
    e.preventDefault();
    endHold();
  };

  const color = STATE_COLORS[timerState];
  const showMs = timerState === 'running';

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '16vh',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
        transition: 'color 0.15s ease'
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(3rem, 15vw, 6rem)',
        fontWeight: 800,
        color,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        transition: 'color 0.15s ease',
        tabularNums: 'tabular-nums',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {timerState === 'idle' && displayMs === 0 ? '0.00' : formatTime(displayMs)}
      </div>

      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: 16,
        fontWeight: 500,
        textAlign: 'center',
        opacity: timerState === 'running' ? 0 : 0.8,
        transition: 'opacity 0.2s'
      }}>
        {timerState === 'idle' || timerState === 'stopped'
          ? 'Mantener espacio o tocar para iniciar'
          : timerState === 'holding'
            ? 'Mantener...'
            : timerState === 'ready'
              ? 'Soltar para iniciar'
              : ''}
      </div>
    </div>
  );
}
