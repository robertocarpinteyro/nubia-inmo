// Aplicaciones — versión original con propuestas LogoCinta / LogoArco.

function BusinessCard({ side = 'front' }) {
  if (side === 'front') {
    return (
      <div style={{ width: 540, height: 320, background: 'var(--paper)', boxSizing:'border-box', padding: 36, position:'relative', border:'1px solid var(--line)', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <LogoCinta size={70} showWord={false} accent="var(--terracotta)" color="var(--ink)"/>
          <span className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)' }}>EST · MMXXIV</span>
        </div>
        <div>
          <div className="display" style={{ fontSize: 36, lineHeight: 1, fontWeight: 400 }}>Nubia</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', marginTop: 4, color:'var(--ink-soft)' }}>INMOBILIARIA</div>
          <div className="serif italic" style={{ fontSize: 14, marginTop: 18, color: 'var(--terracotta)' }}>
            Un lugar entre cielo y tierra.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: 540, height: 320, background: 'var(--ink)', color: 'var(--paper)', boxSizing:'border-box', padding: 36, position:'relative', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <div className="display" style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.1 }}>María Fernanda<br/>Aguilar Rey</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', color:'var(--ocre)', marginTop: 8 }}>ASESORA INMOBILIARIA · CERT. AMPI</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, fontSize: 11 }} className="sans">
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', opacity: .55 }}>TELÉFONO</div>
          <div style={{ marginTop: 3 }}>+52 442 318 04 22</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', opacity: .55 }}>CORREO</div>
          <div style={{ marginTop: 3 }}>maria@nubia.mx</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', opacity: .55 }}>OFICINA</div>
          <div style={{ marginTop: 3 }}>Av. Constituyentes 218<br/>Querétaro, Qro.</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', opacity: .55 }}>WEB</div>
          <div style={{ marginTop: 3 }}>nubiainmobiliaria.mx</div>
        </div>
      </div>
    </div>
  );
}

function CardBoard() {
  return (
    <div style={{ padding: 36, background: 'var(--paper)', width: 1180, boxSizing:'border-box' }}>
      <Header eyebrow="04 · Papelería" title="Tarjeta de presentación" subtitle="85 × 50 mm. Frente con monograma y manifiesto; reverso en tinta sólida con datos." />
      <div style={{ display:'flex', gap: 24, marginTop: 28 }}>
        <div>
          <BusinessCard side="front"/>
          <div className="note" style={{ marginTop: 8 }}>FRENTE · papel algodón 350g</div>
        </div>
        <div>
          <BusinessCard side="back"/>
          <div className="note" style={{ marginTop: 8 }}>REVERSO · tinta directa, sin barniz</div>
        </div>
      </div>
    </div>
  );
}

function ForSaleSign({ kind = 'venta' }) {
  const accent = kind === 'venta' ? 'var(--terracotta)' : 'var(--ocre)';
  return (
    <div style={{ width: 360, height: 460, background: 'var(--paper)', border: '12px solid var(--ink)', boxSizing:'border-box', padding: 22, display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative' }}>
      <div style={{ position:'absolute', top: 28, left: '50%', transform:'translateX(-50%)', width: 14, height: 14, borderRadius:'50%', background:'var(--ink)' }}/>
      <div style={{ paddingTop: 14, textAlign:'center' }}>
        <LogoArco size={84} layout="stack" showWord={false} accent={accent} color="var(--ink)"/>
        <div className="display" style={{ fontSize: 32, marginTop: 10, fontWeight: 400 }}>Nubia</div>
        <div className="mono" style={{ fontSize: 9, letterSpacing:'.22em', color:'var(--ink-soft)', marginTop: 2 }}>INMOBILIARIA</div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div className="display italic" style={{ fontSize: 78, lineHeight: 1, color: accent, fontWeight: 300 }}>
          {kind === 'venta' ? 'Se vende' : 'Se renta'}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, textAlign:'center' }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing:'.12em' }}>442 · 318 · 04 22</div>
        <div className="mono" style={{ fontSize: 9, letterSpacing:'.18em', color:'var(--ink-soft)', marginTop: 4 }}>NUBIAINMOBILIARIA.MX</div>
        <div className="mono" style={{ fontSize: 8, letterSpacing:'.16em', color:'var(--ink-soft)', marginTop: 8 }}>REF · NB-{kind === 'venta' ? '204' : '317'}</div>
      </div>
    </div>
  );
}

function SignBoard() {
  return (
    <div style={{ padding: 36, background: 'var(--paper)', width: 880, boxSizing:'border-box' }}>
      <Header eyebrow="05 · Letreros" title="Venta y renta" subtitle="Mismo sistema, dos acentos. La cursiva del manifiesto sostiene toda la composición." />
      <div style={{ display:'flex', gap: 30, marginTop: 28, justifyContent:'center' }}>
        <ForSaleSign kind="venta"/>
        <ForSaleSign kind="renta"/>
      </div>
    </div>
  );
}

function FacadeBoard() {
  return (
    <div style={{ padding: 0, background: '#d6cfc1', width: 1180, height: 720, boxSizing:'border-box', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset: 0, background: 'linear-gradient(180deg, #e8e0d2 0%, #d6cfc1 55%, #b8af9e 55%, #a89e8c 100%)' }}/>
      <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, height: '62%', background: '#efe9dc', borderTop: '1px solid rgba(0,0,0,.08)' }}/>
      <div style={{ position:'absolute', left: '8%', bottom: '10%', width: '40%', height: '46%', background: 'linear-gradient(180deg, rgba(26,22,18,.85), rgba(26,22,18,.7))', border:'2px solid var(--ink)' }}>
        <div style={{ position:'absolute', inset: 0, background:'repeating-linear-gradient(90deg, transparent 0, transparent 49.5%, rgba(255,255,255,.04) 49.5%, rgba(255,255,255,.04) 50.5%)' }}/>
        <div style={{ position:'absolute', top:'12%', left:'8%', width:'30%', height:'20%', background:'rgba(240,235,227,.12)', transform:'skewX(-20deg)' }}/>
      </div>
      <div style={{ position:'absolute', right: '12%', bottom: 0, width: '14%', height: '52%', background:'var(--ink)' }}>
        <div style={{ position:'absolute', right: 8, top: '50%', width: 4, height: 30, background:'var(--ocre)' }}/>
      </div>

      <div style={{ position:'absolute', top: '8%', left: '50%', transform:'translateX(-50%)', background: 'var(--paper)', padding: '28px 60px', boxShadow:'0 12px 30px rgba(0,0,0,.18)', display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
        <LogoCinta size={120} showWord={false} accent="var(--terracotta)" color="var(--ink)"/>
        <div className="display" style={{ fontSize: 44, lineHeight: 1, fontWeight: 400, marginTop: 6 }}>Nubia</div>
        <div className="mono" style={{ fontSize: 11, letterSpacing:'.32em', color:'var(--ink-soft)' }}>INMOBILIARIA</div>
      </div>

      <div style={{ position:'absolute', left: '11%', bottom: '38%', color: 'var(--paper)' }}>
        <div className="serif italic" style={{ fontSize: 24, color: 'var(--ocre)' }}>Un lugar entre</div>
        <div className="display" style={{ fontSize: 56, fontWeight: 300, lineHeight: 1, marginTop: 4 }}>cielo y tierra.</div>
      </div>

      <div style={{ position:'absolute', right: '6%', bottom: '54%', background:'var(--terracotta)', color:'var(--paper)', padding:'10px 14px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.16em' }}>CONSTITUYENTES · 218</div>
      </div>

      <div style={{ position:'absolute', left: 18, bottom: 14 }}>
        <span className="stamp" style={{ background:'rgba(240,235,227,.85)' }}>Aplicación · fachada de oficina</span>
      </div>
    </div>
  );
}

Object.assign(window, { BusinessCard, CardBoard, ForSaleSign, SignBoard, FacadeBoard });
