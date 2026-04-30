// Web layout — Placeholders y átomos compartidos.

const Placeholder = ({ w='100%', h=200, label='IMAGEN', tone='neutral', radius=0 }) => {
  const bg = tone === 'dark' ? '#1a1612' : tone === 'terra' ? '#b85c3c' : '#d6cfc1';
  const fg = tone === 'dark' || tone === 'terra' ? '#f0ebe3' : '#6b6258';
  const stripe = tone === 'dark' ? 'rgba(240,235,227,.06)' : tone === 'terra' ? 'rgba(240,235,227,.12)' : 'rgba(26,22,18,.05)';
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: `repeating-linear-gradient(135deg, ${bg} 0, ${bg} 12px, ${stripe} 12px, ${stripe} 13px)`,
      display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden',
      border: tone === 'neutral' ? '1px solid rgba(26,22,18,.08)' : 'none'
    }}>
      <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize: 10, letterSpacing:'.18em', color: fg, textTransform:'uppercase', background: bg, padding:'4px 10px' }}>{label}</span>
    </div>
  );
};

// Mini logo for navbar — wraps the LogoCinta component
const NavLogo = ({ color='var(--ink)', accent='var(--terracotta)', size=24 }) => {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
      <LogoCinta size={size*1.6} showWord={false} color={color} accent={accent}/>
      <span className="display" style={{ fontSize: size*0.95, fontWeight: 400, color, letterSpacing:'-0.01em' }}>Nubia</span>
    </div>
  );
};

// Browser frame for showing pages
const BrowserFrame = ({ children, width=1280, height=820, title='nubiainmobiliaria.mx' }) => (
  <div style={{ width, background: '#e6e0d4', border:'1px solid var(--line)', boxShadow:'0 12px 30px rgba(0,0,0,.08)' }}>
    <div style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 14px', borderBottom:'1px solid var(--line)' }}>
      <span style={{ width:10, height:10, borderRadius:'50%', background:'#d97757' }}/>
      <span style={{ width:10, height:10, borderRadius:'50%', background:'#e8b94a' }}/>
      <span style={{ width:10, height:10, borderRadius:'50%', background:'#7da87a' }}/>
      <div style={{ flex:1, textAlign:'center', fontFamily:'JetBrains Mono, monospace', fontSize: 11, color:'var(--ink-soft)' }}>{title}</div>
    </div>
    <div style={{ width, height, overflow:'hidden', background:'var(--paper)' }}>
      {children}
    </div>
  </div>
);

Object.assign(window, { Placeholder, NavLogo, BrowserFrame });
