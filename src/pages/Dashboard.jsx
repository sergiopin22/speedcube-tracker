import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import AlgorithmCard from '../components/AlgorithmCard';
import DrillView from '../components/DrillView';
import ollCases from '../data/oll';
import pllCases from '../data/pll';

export default function Dashboard() {
  const { progress, toggleLearned, toggleLearning } = useAuth();
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState('oll');
  const [drillType, setDrillType] = useState('oll');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const ollLearned = Object.keys(progress.oll || {}).length;
  const pllLearned = Object.keys(progress.pll || {}).length;
  const ollLearning = Object.keys(progress.ollLearning || {}).length;
  const pllLearning = Object.keys(progress.pllLearning || {}).length;

  const ollCategories = useMemo(() => [...new Set(ollCases.map(c => c.category))], []);
  const pllCategories = useMemo(() => [...new Set(pllCases.map(c => c.category))], []);
  const categories = activeTab === 'oll' ? ollCategories : pllCategories;

  const filteredCases = useMemo(() => {
    const cases = activeTab === 'oll' ? ollCases : pllCases;
    const prog = activeTab === 'oll' ? progress.oll : progress.pll;
    const learningProg = activeTab === 'oll' ? (progress.ollLearning || {}) : (progress.pllLearning || {});

    if (filter === 'all') return cases;
    if (filter === 'learned') return cases.filter(c => prog[c.id]);
    if (filter === 'unlearned') return cases.filter(c => !prog[c.id] && !learningProg[c.id]);
    if (filter === 'learning') return cases.filter(c => learningProg[c.id]);
    return cases.filter(c => c.category === filter);
  }, [activeTab, filter, progress]);

  const handleToggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />

      <main style={{ maxWidth: 1150, width: '94%', margin: '0 auto', padding: '24px 28px 48px' }}>
        {/* Progress section */}
        <div style={{
          background: isLight ? '#000' : 'var(--bg-card)',
          border: isLight ? '1px solid #222' : '1px solid var(--border)',
          borderRadius: 20,
          padding: '22px 26px',
          marginBottom: 20
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18
          }}>
            <h2 style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: isLight ? '#fff' : 'var(--accent)',
              letterSpacing: '-0.01em'
            }}>Mi Progreso</h2>
            <span style={{
              fontSize: '0.72rem',
              color: isLight ? '#fff' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              background: isLight ? '#222' : 'var(--bg-secondary)',
              padding: '4px 10px',
              borderRadius: 8
            }}>
              {ollLearned + pllLearned}/78 total
            </span>
          </div>
          <ProgressBar learned={ollLearned} total={57} label="OLL" darkBg={isLight} />
          <ProgressBar learned={pllLearned} total={21} label="PLL" darkBg={isLight} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['oll', 'pll', 'drill'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setFilter('all'); setExpandedId(null); }}
              style={{
                flex: tab === 'drill' ? '0 1 auto' : 1,
                minWidth: tab === 'drill' ? 100 : 0,
                padding: '13px 16px',
                borderRadius: 14,
                border: activeTab === tab ? 'none' : '1px solid var(--border)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                background: activeTab === tab
                  ? tab === 'drill'
                    ? 'linear-gradient(135deg, var(--blue), var(--blue-dark))'
                    : 'linear-gradient(135deg, #ffd700, #ff8c00)'
                  : 'var(--bg-card)',
                color: activeTab === tab ? (tab === 'drill' ? '#fff' : '#000') : 'var(--text-secondary)',
                transition: 'all 0.25s',
                letterSpacing: '0.03em'
              }}
            >
              {tab === 'drill' ? 'Drill' : tab.toUpperCase()}
              {tab !== 'drill' && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginLeft: 8,
                  opacity: 0.8
                }}>
                  {tab === 'oll' ? `${ollLearned}/57` : `${pllLearned}/21`}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'drill' ? (
          <>
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setDrillType('oll')}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: drillType === 'oll' ? 'none' : '1px solid var(--border)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  background: drillType === 'oll' ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'var(--bg-card)',
                  color: drillType === 'oll' ? '#000' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                Drill OLL
              </button>
              <button
                onClick={() => setDrillType('pll')}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: drillType === 'pll' ? 'none' : '1px solid var(--border)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  background: drillType === 'pll' ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'var(--bg-card)',
                  color: drillType === 'pll' ? '#000' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                Drill PLL
              </button>
            </div>
            <DrillView
              drillType={drillType}
              cases={drillType === 'oll' ? ollCases : pllCases}
              progress={progress}
            />
          </>
        ) : (
          <>
            {/* Filters */}
            <div style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: 18,
              padding: '0 2px'
            }}>
              {['all', 'learned', 'unlearned', 'learning', ...categories].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: filter === f ? 'none' : '1px solid var(--border)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: filter === f ? 'var(--accent)' : 'var(--bg-card)',
                    color: filter === f ? '#000' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                    letterSpacing: '0.02em'
                  }}
                >
                  {f === 'all' ? 'Todos' : f === 'learned' ? '✓ Aprendidos' : f === 'unlearned' ? '✗ Por aprender' : f === 'learning' ? '📖 Estoy aprendiendo' : f}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="card-grid">
              {filteredCases.map((c, idx) => (
                <div key={c.id} style={{ animationDelay: `${idx * 20}ms` }}>
                  <AlgorithmCard
                    caseData={c}
                    isPll={activeTab === 'pll'}
                    isLearned={activeTab === 'oll' ? !!(progress.oll && progress.oll[c.id]) : !!(progress.pll && progress.pll[c.id])}
                    isLearning={activeTab === 'oll' ? !!(progress.ollLearning && progress.ollLearning[c.id]) : !!(progress.pllLearning && progress.pllLearning[c.id])}
                    onToggle={() => toggleLearned(activeTab, c.id)}
                    onToggleLearning={() => toggleLearning(activeTab, c.id)}
                    expanded={expandedId === `${activeTab}-${c.id}`}
                    onExpand={() => handleToggleExpand(`${activeTab}-${c.id}`)}
                  />
                </div>
              ))}
            </div>

            {filteredCases.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>
              {filter === 'learned' ? '📚' : filter === 'unlearned' ? '🎉' : '🔍'}
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {filter === 'learned'
                ? 'Aún no has marcado ningún caso como aprendido'
                : filter === 'unlearned'
                ? '¡Felicidades! Has aprendido todos los casos'
                : filter === 'learning'
                ? 'No tienes casos en "Estoy aprendiendo"'
                : 'No hay casos en este filtro'}
            </p>
          </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}