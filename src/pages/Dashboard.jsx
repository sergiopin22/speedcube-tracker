import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import AlgorithmCard from '../components/AlgorithmCard';
import ollCases from '../data/oll';
import pllCases from '../data/pll';

export default function Dashboard() {
  const { progress, toggleLearned } = useAuth();
  const [activeTab, setActiveTab] = useState('oll');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const ollLearned = Object.keys(progress.oll).length;
  const pllLearned = Object.keys(progress.pll).length;

  const ollCategories = useMemo(() => [...new Set(ollCases.map(c => c.category))], []);
  const pllCategories = useMemo(() => [...new Set(pllCases.map(c => c.category))], []);
  const categories = activeTab === 'oll' ? ollCategories : pllCategories;

  const filteredCases = useMemo(() => {
    const cases = activeTab === 'oll' ? ollCases : pllCases;
    const prog = activeTab === 'oll' ? progress.oll : progress.pll;

    if (filter === 'all') return cases;
    if (filter === 'learned') return cases.filter(c => prog[c.id]);
    if (filter === 'unlearned') return cases.filter(c => !prog[c.id]);
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
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
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
              color: 'var(--accent)',
              letterSpacing: '-0.01em'
            }}>Mi Progreso</h2>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-secondary)',
              padding: '4px 10px',
              borderRadius: 8
            }}>
              {ollLearned + pllLearned}/78 total
            </span>
          </div>
          <ProgressBar learned={ollLearned} total={57} label="OLL" />
          <ProgressBar learned={pllLearned} total={21} label="PLL" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['oll', 'pll'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setFilter('all'); setExpandedId(null); }}
              style={{
                flex: 1,
                padding: '13px',
                borderRadius: 14,
                border: activeTab === tab ? 'none' : '1px solid var(--border)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                background: activeTab === tab
                  ? 'linear-gradient(135deg, #ffd700, #ff8c00)'
                  : 'var(--bg-card)',
                color: activeTab === tab ? '#000' : 'var(--text-secondary)',
                transition: 'all 0.25s',
                letterSpacing: '0.03em'
              }}
            >
              {tab.toUpperCase()}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                marginLeft: 8,
                opacity: 0.8
              }}>
                {tab === 'oll' ? `${ollLearned}/57` : `${pllLearned}/21`}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: 18,
          padding: '0 2px'
        }}>
          {['all', 'learned', 'unlearned', ...categories].map(f => (
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
              {f === 'all' ? 'Todos' : f === 'learned' ? '✓ Aprendidos' : f === 'unlearned' ? '✗ Por aprender' : f}
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
                isLearned={activeTab === 'oll' ? !!progress.oll[c.id] : !!progress.pll[c.id]}
                onToggle={() => toggleLearned(activeTab, c.id)}
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
                : 'No hay casos en este filtro'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}