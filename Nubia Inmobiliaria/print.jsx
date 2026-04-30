// Print layout — one page per board.

function Page({ eyebrow, title, num, children, totalPages }) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">{eyebrow}</div>
          <div className="page-title" style={{ marginTop: 4 }}>{title}</div>
        </div>
        <div className="page-num">{String(num).padStart(2,'0')} / {String(totalPages).padStart(2,'0')} · NUBIA · MX</div>
      </div>
      <div className="page-body">{children}</div>
    </div>
  );
}

function Cover() {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative' }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing:'.22em', color:'var(--terracotta)' }}>NUBIA · INMOBILIARIA · MX</div>
      <div>
        <div className="display" style={{ fontSize: 92, fontWeight: 300, lineHeight: 1, letterSpacing:'-0.015em' }}>
          Identidad gráfica<br/>
          <span style={{ fontStyle:'italic', color:'var(--terracotta)' }}>&amp;</span> sistema visual.
        </div>
        <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 24, maxWidth: 540, lineHeight: 1.55 }}>
          Una marca para una inmobiliaria mixta — residencial, comercial y desarrollos — moderna y minimalista sin perder calidez. Cinco direcciones de logo, paleta de tierra cálida, sistema tipográfico editorial.
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid var(--line)', paddingTop: 12 }}>
        <Spec label="VOLUMEN" value="I · Marca"/>
        <Spec label="DIRECCIONES" value="5 logos"/>
        <Spec label="PERSONALIDAD" value="Moderna · confiable"/>
        <Spec label="FECHA" value="04 · 2026"/>
      </div>
      <svg width="160" height="160" viewBox="0 0 200 200" style={{ position:'absolute', right: 0, top: 30 }}>
        <path d="M 20 130 A 80 80 0 0 1 180 130" fill="none" stroke="var(--terracotta)" strokeWidth="6" strokeLinecap="round"/>
        <line x1="14" y1="130" x2="186" y2="130" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
function Spec({label, value}) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 8, letterSpacing:'.16em', color:'var(--ink-soft)' }}>{label}</div>
      <div className="display" style={{ fontSize: 18, fontWeight: 400, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function LogoCard({ Title, subtitle, children, bg = 'var(--paper)' }) {
  return (
    <div style={{ background: bg, border:'1px solid var(--line)', boxSizing:'border-box', padding: 18, display:'flex', flexDirection:'column', height: '100%', minHeight: 220 }}>
      <div style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
      <div style={{ borderTop:'1px dotted var(--line)', paddingTop: 10, marginTop: 10 }}>
        <div className="mono" style={{ fontSize: 8, letterSpacing:'.14em', color: bg === 'var(--ink)' ? 'rgba(240,235,227,.7)' : 'var(--ink-soft)' }}>{Title}</div>
        <div className="serif italic" style={{ fontSize: 13, marginTop: 3, color: bg === 'var(--ink)' ? 'var(--paper)' : 'var(--ink)' }}>{subtitle}</div>
      </div>
    </div>
  );
}

const TOTAL = 9;

function PrintApp() {
  return (
    <>
      {/* 01 · Cover */}
      <Page eyebrow="" title="" num={1} totalPages={TOTAL}>
        <Cover/>
      </Page>

      {/* 02 · Logos 1-3 */}
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">01 · LOGOS</div>
            <div className="page-title" style={{ marginTop: 4 }}>Direcciones — 1 a 3</div>
          </div>
          <div className="page-num">02 / {String(TOTAL).padStart(2,'0')} · NUBIA · MX</div>
        </div>
        <div className="grid-3" style={{ flex: 1 }}>
          <LogoCard Title="01 · ARCO HORIZONTE" subtitle="La nube, el arco, la tierra.">
            <LogoArco size={130} layout="stack"/>
          </LogoCard>
          <LogoCard Title="02 · MONOGRAMA · UMBRAL" subtitle="Una N como puerta.">
            <LogoMonograma size={130}/>
          </LogoCard>
          <LogoCard Title="03 · WORDMARK" subtitle="La 'i' itálica como acento.">
            <LogoWordmark size={110}/>
          </LogoCard>
        </div>
      </div>

      {/* 03 · Logos 4-5 + recomendada */}
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">01 · LOGOS</div>
            <div className="page-title" style={{ marginTop: 4 }}>Direcciones — 4, 5 y recomendada</div>
          </div>
          <div className="page-num">03 / {String(TOTAL).padStart(2,'0')} · NUBIA · MX</div>
        </div>
        <div className="grid-3" style={{ flex: 1 }}>
          <LogoCard Title="04 · SELLO · INSIGNIA" subtitle="Para escrituras y aplicaciones formales.">
            <LogoSello size={170}/>
          </LogoCard>
          <LogoCard Title="05 · CINTA · NUBES" subtitle="Tres arcos sobre el horizonte.">
            <LogoCinta size={130}/>
          </LogoCard>
          <LogoCard bg="var(--ink)" Title="★ RECOMENDADA" subtitle="Cinta + wordmark.">
            <div style={{ color: 'var(--paper)' }}>
              <LogoCinta size={130} color="#f0ebe3" accent="#c89968"/>
            </div>
          </LogoCard>
        </div>
      </div>

      {/* 04 · Estudios */}
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">02 · ESTUDIOS</div>
            <div className="page-title" style={{ marginTop: 4 }}>Variantes de uso — logo recomendado</div>
          </div>
          <div className="page-num">04 / {String(TOTAL).padStart(2,'0')} · NUBIA · MX</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gridTemplateRows:'1fr 1fr', gap:'8mm', flex:1 }}>
          <div style={{ background:'var(--paper)', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoCinta size={120} mono={true} color="var(--ink)"/>
          </div>
          <div style={{ background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoCinta size={120} mono={true} color="var(--paper)"/>
          </div>
          <div style={{ background:'var(--ocre)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoCinta size={120} color="var(--ink)" accent="var(--terracotta-deep)"/>
          </div>
          <div style={{ background:'var(--terracotta)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', placeSelf:'center', width: '70%', aspectRatio: '1' }}>
            <LogoCinta size={110} showWord={false} color="var(--paper)" accent="var(--paper)" mono={true}/>
          </div>
          <div style={{ background:'var(--paper)', border:'1px solid var(--line)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 14 }}>
            <LogoCinta size={100} showWord={false}/>
            <LogoCinta size={50} showWord={false}/>
            <LogoCinta size={22} showWord={false}/>
            <span className="mono" style={{ fontSize: 8, letterSpacing:'.14em', color:'var(--ink-soft)' }}>100 · 50 · 22 PX</span>
          </div>
          <div style={{ background:'var(--paper)', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoArco size={100} layout="horizontal"/>
          </div>
        </div>
      </div>

      {/* 05 · Paleta */}
      <Page eyebrow="03 · COLOR" title="Paleta" num={5} totalPages={TOTAL}>
        <PaletteBoard/>
      </Page>

      {/* 06 · Tipografía */}
      <Page eyebrow="04 · TIPOGRAFÍA" title="Sistema tipográfico" num={6} totalPages={TOTAL}>
        <div style={{ width:'100%', transform: 'scale(0.78)', transformOrigin: 'top center' }}>
          <TypeBoard/>
        </div>
      </Page>

      {/* 07 · Iconografía */}
      <Page eyebrow="05 · ICONOGRAFÍA" title="Sistema de íconos" num={7} totalPages={TOTAL}>
        <IconBoard/>
      </Page>

      {/* 08 · Tarjeta + Letreros */}
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">06 · APLICACIONES</div>
            <div className="page-title" style={{ marginTop: 4 }}>Tarjeta y letreros</div>
          </div>
          <div className="page-num">08 / {String(TOTAL).padStart(2,'0')} · NUBIA · MX</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: '8mm', flex: 1, alignItems:'center', justifyContent:'center' }}>
          <div style={{ display:'flex', gap: 18 }}>
            <BusinessCard side="front"/>
            <BusinessCard side="back"/>
          </div>
          <div style={{ display:'flex', gap: 18 }}>
            <div style={{ transform:'scale(0.55)', transformOrigin:'top left', width: 360*0.55, height: 460*0.55 }}>
              <ForSaleSign kind="venta"/>
            </div>
            <div style={{ transform:'scale(0.55)', transformOrigin:'top left', width: 360*0.55, height: 460*0.55 }}>
              <ForSaleSign kind="renta"/>
            </div>
          </div>
        </div>
      </div>

      {/* 09 · Fachada */}
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">06 · APLICACIONES</div>
            <div className="page-title" style={{ marginTop: 4 }}>Fachada de oficina</div>
          </div>
          <div className="page-num">09 / {String(TOTAL).padStart(2,'0')} · NUBIA · MX</div>
        </div>
        <div className="page-body">
          <div style={{ width: '100%', maxWidth: 1180, transform:'scale(0.62)', transformOrigin:'center' }}>
            <FacadeBoard/>
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PrintApp/>);
