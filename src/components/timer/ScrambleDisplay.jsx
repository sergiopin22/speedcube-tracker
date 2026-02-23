export default function ScrambleDisplay({ scramble }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '10px 20px',
      marginBottom: 10,
      textAlign: 'center',
      userSelect: 'none'
    }}>
      <div style={{
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 700,
        marginBottom: 5
      }}>
        Scramble
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
        color: 'var(--text-primary)',
        fontWeight: 600,
        lineHeight: 1.6,
        letterSpacing: '0.04em',
        wordBreak: 'break-word'
      }}>
        {scramble}
      </div>
    </div>
  );
}
