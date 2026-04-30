// System: color palette, typography, iconography for Nubia.

const PALETTE = [
  { name: 'Papel',       hex: '#f0ebe3', role: 'Fondo principal',     ink: '#1a1612' },
  { name: 'Papel Cálido',hex: '#e6e0d4', role: 'Fondo secundario',    ink: '#1a1612' },
  { name: 'Tinta',       hex: '#1a1612', role: 'Texto / línea',       ink: '#f0ebe3' },
  { name: 'Tinta Suave', hex: '#6b6258', role: 'Texto secundario',    ink: '#f0ebe3' },
  { name: 'Terracota',   hex: '#b85c3c', role: 'Acento principal',    ink: '#f0ebe3' },
  { name: 'Terracota O.',hex: '#8e3f24', role: 'Acento profundo',     ink: '#f0ebe3' },
  { name: 'Ocre',        hex: '#c89968', role: 'Acento cálido',       ink: '#1a1612' },
  { name: 'Salvia',      hex: '#8a8779', role: 'Neutro frío',         ink: '#f0ebe3' },
];

function PaletteBoard() {
  return (
    <div style={{ padding: 36, background: 'var(--paper)', width: 880, boxSizing:'border-box' }}>
      <Header eyebrow="01 · Color" title="Paleta" subtitle="Neutros cálidos sobre papel crudo, con acento terracota y ocre que evocan la tierra mexicana sin caer en el cliché." />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14, marginTop: 28 }}>
        {PALETTE.map(c => (
          <div key={c.hex} style={{ background: c.hex, color: c.ink, padding: 14, height: 170, display:'flex', flexDirection:'column', justifyContent:'space-between', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.1em', opacity: .8 }}>0{PALETTE.indexOf(c)+1}</div>
            <div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1.05 }}>{c.name}</div>
              <div className="mono" style={{ fontSize: 10, marginTop: 6, opacity: .85 }}>{c.hex.toUpperCase()}</div>
              <div className="mono" style={{ fontSize: 9, marginTop: 2, opacity: .7, letterSpacing:'.05em' }}>{c.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap: 14, marginTop: 22, alignItems:'center' }}>
        <span className="stamp">Proporciones recomendadas</span>
        <div style={{ flex:1, height: 28, display:'flex', border: '1px solid var(--line)' }}>
          <div style={{ flex: 60, background:'#f0ebe3' }}/>
          <div style={{ flex: 22, background:'#1a1612' }}/>
          <div style={{ flex: 10, background:'#b85c3c' }}/>
          <div style={{ flex: 5,  background:'#c89968' }}/>
          <div style={{ flex: 3,  background:'#8a8779' }}/>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-soft)' }}>60 / 22 / 10 / 5 / 3</span>
      </div>
    </div>
  );
}

function TypeBoard() {
  return (
    <div style={{ padding: 36, background: 'var(--paper)', width: 880, boxSizing:'border-box' }}>
      <Header eyebrow="02 · Tipografía" title="Sistema tipográfico" subtitle="Una serif editorial para lo poético, una sans neutra para la información, y monoespaciada para los datos." />
      <div style={{ marginTop: 32, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)', letterSpacing:'.12em' }}>PRIMARIA · DISPLAY</span>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)' }}>Fraunces · 300 / 400 / italic</span>
        </div>
        <div className="display" style={{ fontSize: 96, fontWeight: 300, lineHeight: 1, marginTop: 14, letterSpacing:'-0.01em' }}>
          Un lugar entre <span style={{ fontStyle:'italic', color: 'var(--terracotta)' }}>cielo</span> y tierra.
        </div>
        <div className="display" style={{ fontSize: 18, fontWeight: 400, marginTop: 10, color:'var(--ink-soft)', letterSpacing:'.02em' }}>
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Ññ Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz · 0123456789
        </div>
      </div>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)', letterSpacing:'.12em' }}>SECUNDARIA · TEXTO</span>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)' }}>Geist · 300 / 400 / 500</span>
        </div>
        <div className="sans" style={{ fontSize: 22, fontWeight: 400, marginTop: 12, lineHeight: 1.4, maxWidth: 720 }}>
          Cada propiedad cuenta una historia. La nuestra es ayudar a que esa historia encuentre techo, paredes y un lugar donde quedarse.
        </div>
        <div className="sans" style={{ fontSize: 12, marginTop: 10, color:'var(--ink-soft)', letterSpacing:'.02em' }}>
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Ññ Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
        </div>
      </div>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)', letterSpacing:'.12em' }}>DETALLES · DATOS</span>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)' }}>JetBrains Mono · 400 / 500</span>
        </div>
        <div className="mono" style={{ fontSize: 14, marginTop: 14, letterSpacing:'.04em' }}>
          REF · NB-204 &nbsp;·&nbsp; 320 m² &nbsp;·&nbsp; $14,800,000 MXN &nbsp;·&nbsp; QUERÉTARO
        </div>
      </div>

      {/* Escala */}
      <div style={{ marginTop: 32, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <span className="mono" style={{ fontSize: 10, color:'var(--ink-soft)', letterSpacing:'.12em' }}>ESCALA TIPOGRÁFICA</span>
        <div style={{ display:'flex', flexDirection:'column', gap: 6, marginTop: 14 }}>
          {[
            ['Display', 72, 'display', 300],
            ['H1',      40, 'display', 400],
            ['H2',      28, 'display', 400],
            ['Body',    16, 'sans',    400],
            ['Caption', 12, 'mono',    400],
          ].map(([label, size, klass, w]) => (
            <div key={label} style={{ display:'flex', alignItems:'baseline', gap: 16, borderBottom:'1px dotted var(--line-soft)', padding:'4px 0' }}>
              <span className="mono" style={{ width: 70, fontSize: 10, color:'var(--ink-soft)' }}>{label}</span>
              <span className="mono" style={{ width: 50, fontSize: 10, color:'var(--ink-soft)' }}>{size}px</span>
              <span className={klass} style={{ fontSize: size, fontWeight: w, lineHeight: 1.1 }}>Nubia</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconBoard() {
  // Sistema de iconos lineales — 1.25px stroke, 24x24, esquinas redondeadas
  const Icon = ({ name, draw }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 8, padding: 14, border:'1px solid var(--line)', background:'#fff' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a1612" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {draw}
      </svg>
      <span className="mono" style={{ fontSize: 9, letterSpacing:'.08em', color:'var(--ink-soft)' }}>{name.toUpperCase()}</span>
    </div>
  );
  return (
    <div style={{ padding: 36, background: 'var(--paper)', width: 880, boxSizing:'border-box' }}>
      <Header eyebrow="03 · Iconografía" title="Sistema de íconos" subtitle="Línea de 1.25px, esquinas redondeadas, geometría primaria. Sin sombras, sin rellenos. Tono de la marca: dibujado a mano firme." />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 12, marginTop: 28 }}>
        <Icon name="Arco" draw={<>
          <path d="M3 18 a9 9 0 0 1 18 0"/>
          <line x1="2" y1="18" x2="22" y2="18"/>
        </>}/>
        <Icon name="Llave" draw={<>
          <circle cx="8" cy="12" r="3.5"/>
          <line x1="11.5" y1="12" x2="21" y2="12"/>
          <line x1="17" y1="12" x2="17" y2="15"/>
          <line x1="20" y1="12" x2="20" y2="14.5"/>
        </>}/>
        <Icon name="Recámara" draw={<>
          <path d="M3 16 v-4 a3 3 0 0 1 3-3 h12 a3 3 0 0 1 3 3 v4"/>
          <line x1="3" y1="16" x2="21" y2="16"/>
          <line x1="3" y1="19" x2="21" y2="19"/>
        </>}/>
        <Icon name="Baño" draw={<>
          <path d="M5 11 v-4 a2 2 0 0 1 4 0"/>
          <line x1="3" y1="11" x2="21" y2="11"/>
          <path d="M4 11 v3 a4 4 0 0 0 4 4 h8 a4 4 0 0 0 4-4 v-3"/>
        </>}/>
        <Icon name="Metros" draw={<>
          <rect x="3" y="3" width="18" height="18"/>
          <line x1="3" y1="9" x2="6" y2="9"/>
          <line x1="3" y1="15" x2="6" y2="15"/>
          <line x1="9" y1="3" x2="9" y2="6"/>
          <line x1="15" y1="3" x2="15" y2="6"/>
        </>}/>
        <Icon name="Auto" draw={<>
          <path d="M3 16 v-3 l2-5 h14 l2 5 v3"/>
          <circle cx="7" cy="17" r="1.5"/>
          <circle cx="17" cy="17" r="1.5"/>
        </>}/>
        <Icon name="Ubicación" draw={<>
          <path d="M12 21 c-4-5-7-8-7-12 a7 7 0 0 1 14 0 c0 4-3 7-7 12z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </>}/>
        <Icon name="Calendario" draw={<>
          <rect x="3" y="5" width="18" height="16" rx="1"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="8" y1="3" x2="8" y2="7"/>
          <line x1="16" y1="3" x2="16" y2="7"/>
        </>}/>
        <Icon name="Plano" draw={<>
          <rect x="3" y="3" width="18" height="18"/>
          <line x1="3" y1="11" x2="14" y2="11"/>
          <line x1="14" y1="3" x2="14" y2="21"/>
          <line x1="14" y1="16" x2="21" y2="16"/>
        </>}/>
        <Icon name="Jardín" draw={<>
          <path d="M12 21 v-7"/>
          <path d="M12 14 c-3 0-5-2-5-5 0-2 2-3 5-3 s5 1 5 3 c0 3-2 5-5 5z"/>
          <line x1="3" y1="21" x2="21" y2="21"/>
        </>}/>
        <Icon name="Sol" draw={<>
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="3" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="21" y2="12"/>
          <line x1="5.6" y1="5.6" x2="7" y2="7"/>
          <line x1="17" y1="17" x2="18.4" y2="18.4"/>
        </>}/>
        <Icon name="Agua" draw={<>
          <path d="M12 3 c4 5 7 8 7 12 a7 7 0 0 1-14 0 c0-4 3-7 7-12z"/>
        </>}/>
      </div>
    </div>
  );
}

function Header({ eyebrow, title, subtitle }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', color: 'var(--terracotta)', textTransform:'uppercase' }}>{eyebrow}</div>
      <div className="display" style={{ fontSize: 38, fontWeight: 400, marginTop: 8, lineHeight: 1.05 }}>{title}</div>
      {subtitle && <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 8, maxWidth: 640, lineHeight: 1.5 }}>{subtitle}</div>}
    </div>
  );
}

Object.assign(window, { PaletteBoard, TypeBoard, IconBoard, Header });
