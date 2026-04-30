// Top-level layout — versión original con 5 propuestas.

function LogoCard({ Title, subtitle, children, bg = 'var(--paper)', height = 360 }) {
  return (
    <div style={{ width: 380, height, background: bg, border:'1px solid var(--line)', boxSizing:'border-box', padding: 24, display:'flex', flexDirection:'column' }}>
      <div style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
      <div style={{ borderTop:'1px dotted var(--line)', paddingTop: 12, marginTop: 12 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)' }}>{Title}</div>
        <div className="serif italic" style={{ fontSize: 14, marginTop: 4, color:'var(--ink)' }}>{subtitle}</div>
      </div>
    </div>
  );
}

function CoverBoard() {
  return (
    <div style={{ width: 1180, height: 660, background: 'var(--paper)', boxSizing:'border-box', padding: 60, position:'relative', overflow:'hidden' }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing:'.22em', color:'var(--terracotta)' }}>NUBIA · INMOBILIARIA · MX</div>
      <div className="display" style={{ fontSize: 110, fontWeight: 300, lineHeight: 1, marginTop: 28, letterSpacing:'-0.015em' }}>
        Identidad gráfica<br/>
        <span style={{ fontStyle:'italic', color:'var(--terracotta)' }}>&amp;</span> sistema visual.
      </div>
      <div className="sans" style={{ fontSize: 16, color:'var(--ink-soft)', marginTop: 28, maxWidth: 600, lineHeight: 1.55 }}>
        Una marca para una inmobiliaria mixta — residencial, comercial y desarrollos — que busca verse moderna y minimalista sin perder calidez. Cinco direcciones de logo, una paleta de tierra cálida, un sistema tipográfico editorial.
      </div>

      <div style={{ position:'absolute', left: 60, right: 60, bottom: 40, display:'flex', justifyContent:'space-between', borderTop:'1px solid var(--line)', paddingTop: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)' }}>VOLUMEN</div>
          <div className="display" style={{ fontSize: 22, fontWeight: 400, marginTop: 4 }}>I · Marca</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)' }}>DIRECCIONES</div>
          <div className="display" style={{ fontSize: 22, fontWeight: 400, marginTop: 4 }}>5 logos</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)' }}>PERSONALIDAD</div>
          <div className="display" style={{ fontSize: 22, fontWeight: 400, marginTop: 4 }}>Moderna · confiable</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)' }}>FECHA</div>
          <div className="display" style={{ fontSize: 22, fontWeight: 400, marginTop: 4 }}>04 · 2026</div>
        </div>
      </div>

      <svg width="200" height="200" viewBox="0 0 200 200" style={{ position:'absolute', right: 60, top: 60 }}>
        <path d="M 20 130 A 80 80 0 0 1 180 130" fill="none" stroke="var(--terracotta)" strokeWidth="6" strokeLinecap="round"/>
        <line x1="14" y1="130" x2="186" y2="130" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="cover" title="Nubia Inmobiliaria" subtitle="Identidad y sistema visual · v1">
        <DCArtboard id="cover" label="Portada" width={1180} height={660}>
          <CoverBoard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="logos" title="Direcciones de logo" subtitle="Cinco propuestas — desde lo más editorial hasta lo más simbólico">
        <DCArtboard id="l1" label="01 · Arco Horizonte" width={380} height={360}>
          <LogoCard Title="01 · ARCO HORIZONTE · COMBINADA" subtitle="La nube, el arco, la tierra. Lo más representativo del nombre.">
            <LogoArco size={150} layout="stack"/>
          </LogoCard>
        </DCArtboard>
        <DCArtboard id="l2" label="02 · Monograma N" width={380} height={360}>
          <LogoCard Title="02 · MONOGRAMA · UMBRAL" subtitle="Una N como puerta. Geometría firme y estable.">
            <LogoMonograma size={150}/>
          </LogoCard>
        </DCArtboard>
        <DCArtboard id="l3" label="03 · Wordmark" width={380} height={360}>
          <LogoCard Title="03 · WORDMARK · EDITORIAL" subtitle="Solo el nombre. La 'i' itálica como acento de luz.">
            <LogoWordmark size={140}/>
          </LogoCard>
        </DCArtboard>
        <DCArtboard id="l4" label="04 · Sello" width={380} height={360}>
          <LogoCard Title="04 · SELLO · INSIGNIA" subtitle="Para escrituras, sellos de cera, aplicaciones formales.">
            <LogoSello size={210}/>
          </LogoCard>
        </DCArtboard>
        <DCArtboard id="l5" label="05 · Cinta" width={380} height={360}>
          <LogoCard Title="05 · CINTA · NUBES" subtitle="Tres arcos como nubes sobre el horizonte. La más distintiva.">
            <LogoCinta size={150}/>
          </LogoCard>
        </DCArtboard>
        <DCArtboard id="l6" label="Recomendada" width={380} height={360}>
          <LogoCard bg="var(--ink)" Title="★ RECOMENDADA · 05 + 03" subtitle="Cinta como mark + wordmark como respaldo.">
            <div style={{ color: 'var(--paper)' }}>
              <LogoCinta size={150} color="#f0ebe3" accent="#c89968"/>
            </div>
          </LogoCard>
        </DCArtboard>
      </DCSection>

      <DCSection id="logo-studies" title="Estudios — logo recomendado" subtitle="Variantes de uso, escala y contraste">
        <DCArtboard id="s1" label="Mono · papel" width={380} height={280}>
          <div style={{ width:380, height:280, background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--line)' }}>
            <LogoCinta size={150} mono={true} color="var(--ink)"/>
          </div>
        </DCArtboard>
        <DCArtboard id="s2" label="Mono · tinta" width={380} height={280}>
          <div style={{ width:380, height:280, background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoCinta size={150} mono={true} color="var(--paper)"/>
          </div>
        </DCArtboard>
        <DCArtboard id="s3" label="Color · ocre" width={380} height={280}>
          <div style={{ width:380, height:280, background:'var(--ocre)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoCinta size={150} color="var(--ink)" accent="var(--terracotta-deep)"/>
          </div>
        </DCArtboard>
        <DCArtboard id="s4" label="Avatar redondo" width={280} height={280}>
          <div style={{ width:280, height:280, background:'var(--terracotta)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogoCinta size={130} showWord={false} color="var(--paper)" accent="var(--paper)" mono={true}/>
          </div>
        </DCArtboard>
        <DCArtboard id="s5" label="Tamaño mínimo · 24px" width={280} height={280}>
          <div style={{ width:280, height:280, background:'var(--paper)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 18, border:'1px solid var(--line)' }}>
            <LogoCinta size={140} showWord={false}/>
            <LogoCinta size={70} showWord={false}/>
            <LogoCinta size={28} showWord={false}/>
            <span className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)' }}>140 · 70 · 28 PX</span>
          </div>
        </DCArtboard>
        <DCArtboard id="s6" label="Lockup horizontal" width={520} height={280}>
          <div style={{ width:520, height:280, background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--line)' }}>
            <LogoArco size={120} layout="horizontal"/>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="palette" title="Paleta">
        <DCArtboard id="p1" label="Color system" width={880} height={520}>
          <PaletteBoard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="type" title="Tipografía">
        <DCArtboard id="t1" label="Type system" width={880} height={920}>
          <TypeBoard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="icons" title="Iconografía">
        <DCArtboard id="i1" label="Iconos" width={880} height={500}>
          <IconBoard/>
        </DCArtboard>
      </DCSection>

      <DCSection id="apps" title="Aplicaciones" subtitle="La marca en uso">
        <DCArtboard id="a1" label="Tarjeta de presentación" width={1180} height={520}>
          <CardBoard/>
        </DCArtboard>
        <DCArtboard id="a2" label="Letreros · venta y renta" width={880} height={680}>
          <SignBoard/>
        </DCArtboard>
        <DCArtboard id="a3" label="Aplicación · fachada" width={1180} height={720}>
          <FacadeBoard/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
