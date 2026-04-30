// Hi-fi homepage variants — three flavors using Nubia brand.

const Nav = ({ dark=false, logoVariant='cinta' }) => {
  const ink = dark ? '#f0ebe3' : '#1a1612';
  const accent = '#b85c3c';
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 40px', borderBottom: dark ? '1px solid rgba(240,235,227,.12)' : '1px solid var(--line-soft)' }}>
      <NavLogo color={ink} accent={accent} size={22}/>
      <div style={{ display:'flex', gap: 32, fontFamily:'Geist, sans-serif', fontSize: 13, color: ink, letterSpacing:'.02em' }}>
        <span>Propiedades</span><span>Desarrollos</span><span>Nosotros</span><span>Contacto</span>
      </div>
      <div style={{ display:'flex', gap: 14, alignItems:'center' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing:'.18em', color: ink, opacity:.7 }}>ES · EN</span>
        <div style={{ padding:'8px 18px', border:`1px solid ${ink}`, borderRadius: 99, fontFamily:'Geist', fontSize: 12, color: ink }}>Acceder</div>
      </div>
    </div>
  );
};

const Foot = ({ dark=false }) => {
  const bg = dark ? 'transparent' : 'var(--ink)';
  const fg = '#f0ebe3';
  return (
    <div style={{ background: bg, color: fg, padding:'40px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap: 30, borderTop: dark ? '1px solid rgba(240,235,227,.12)' : 'none' }}>
      <div>
        <NavLogo color={fg} accent="#c89968" size={26}/>
        <div className="serif italic" style={{ fontSize: 16, marginTop: 14, color: '#c89968', maxWidth: 280 }}>Un lugar entre cielo y tierra.</div>
      </div>
      {[
        ['EXPLORAR', ['Residencial','Comercial','Desarrollos','Terrenos']],
        ['NUBIA', ['Sobre nosotros','Asesores','Blog','Prensa']],
        ['CONTACTO', ['Constituyentes 218','Querétaro, Qro.','442 318 04 22','hola@nubia.mx']],
      ].map(([title, items])=>(
        <div key={title}>
          <div className="mono" style={{ fontSize: 9, letterSpacing:'.22em', opacity:.55 }}>{title}</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 6, marginTop: 12, fontFamily:'Geist', fontSize: 12 }}>
            {items.map(i=><span key={i}>{i}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Variant 1 · Editorial (JamesEdition-inspired) ─────────────
function HomeEditorial({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      {/* Hero — full-bleed image with overlay manifesto */}
      <div style={{ position:'relative', height: 620 }}>
        <Placeholder w="100%" h={620} label="Hero · propiedad destacada · 1920×1080" tone="dark"/>
        <div style={{ position:'absolute', inset: 0, background:'linear-gradient(180deg, rgba(26,22,18,0) 40%, rgba(26,22,18,.55) 100%)' }}/>
        <div style={{ position:'absolute', top: 60, left: 50 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.24em', color:'#c89968' }}>DESTACADA · QUERÉTAR0</div>
        </div>
        <div style={{ position:'absolute', bottom: 100, left: 50, color:'var(--paper)', maxWidth: 700 }}>
          <div className="display" style={{ fontSize: 84, fontWeight: 300, lineHeight: .98, letterSpacing:'-0.015em' }}>
            Un lugar<br/>entre <span style={{ fontStyle:'italic', color:'#c89968' }}>cielo</span> y tierra.
          </div>
        </div>
        {/* Floating search bar */}
        <div style={{ position:'absolute', left: '50%', bottom: -36, transform:'translateX(-50%)', background:'var(--paper)', boxShadow:'0 16px 40px rgba(0,0,0,.18)', display:'flex', alignItems:'center', padding:'8px 8px 8px 24px', gap: 14, width: 880 }}>
          {['Tipo de propiedad','Ubicación','Rango de precio'].map(f=>(
            <div key={f} style={{ flex:1, paddingRight: 14, borderRight:'1px solid var(--line-soft)' }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)' }}>{f.toUpperCase()}</div>
              <div className="sans" style={{ fontSize: 13, marginTop: 4 }}>Cualquiera ▾</div>
            </div>
          ))}
          <div style={{ background:'var(--ink)', color:'var(--paper)', padding:'18px 32px', fontFamily:'Geist', fontSize: 13, letterSpacing:'.04em' }}>Buscar →</div>
        </div>
      </div>

      {/* Featured properties */}
      <div style={{ padding: '90px 50px 50px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line)', paddingBottom: 16 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>01 · COLECCIÓN</div>
            <div className="display" style={{ fontSize: 44, fontWeight: 300, marginTop: 6 }}>Propiedades destacadas</div>
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing:'.14em', color:'var(--ink-soft)' }}>VER LAS 187 →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 30, marginTop: 30 }}>
          {[
            ['Casa Constituyentes','Querétaro · 320 m²','$14,800,000 MXN'],
            ['Loft El Refugio','San Miguel · 110 m²','$5,400,000 MXN'],
            ['Hacienda Los Olivos','Tequisquiapan · 1,400 m²','$28,000,000 MXN'],
          ].map(([t,m,p],i)=>(
            <div key={i}>
              <Placeholder h={320} label={`PROP · NB-${200+i}`} tone="neutral"/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop: 14 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)' }}>NB-{200+i}</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--terracotta)' }}>EN VENTA</div>
              </div>
              <div className="display" style={{ fontSize: 24, marginTop: 6 }}>{t}</div>
              <div className="sans" style={{ fontSize: 12, color:'var(--ink-soft)', marginTop: 2 }}>{m}</div>
              <div className="display" style={{ fontSize: 18, fontStyle:'italic', marginTop: 8, color:'var(--terracotta)' }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding:'40px 50px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 14 }}>
          {[
            ['Residencial','78 propiedades'],
            ['Comercial','42 propiedades'],
            ['Desarrollos','12 proyectos'],
          ].map(([t,m],i)=>(
            <div key={i} style={{ background: i===1 ? 'var(--terracotta)' : 'var(--ink)', color:'var(--paper)', padding: 30, height: 220, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', opacity:.65 }}>0{i+1}</div>
              <div>
                <div className="display" style={{ fontSize: 36, fontWeight: 300 }}>{t}</div>
                <div className="sans" style={{ fontSize: 12, marginTop: 6, opacity:.8 }}>{m}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', marginTop: 16 }}>EXPLORAR →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About strip */}
      <div style={{ padding:'80px 50px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 60, alignItems:'center' }}>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>02 · NOSOTROS</div>
          <div className="display" style={{ fontSize: 56, fontWeight: 300, lineHeight: 1, marginTop: 14, letterSpacing:'-0.01em' }}>
            Cada propiedad cuenta una <span style={{ fontStyle:'italic' }}>historia</span>.
          </div>
          <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 20, lineHeight: 1.6, maxWidth: 460 }}>
            Llevamos quince años acompañando a familias y empresarios a encontrar el espacio justo. No vendemos casas, abrimos puertas — y la diferencia, créenos, se nota desde la primera visita.
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing:'.18em', marginTop: 24, color:'var(--ink)' }}>CONOCER AL EQUIPO →</div>
        </div>
        <Placeholder h={460} label="EQUIPO · OFICINA · QUERÉTARO" tone="terra"/>
      </div>

      {/* Testimonial */}
      <div style={{ padding:'60px 50px', background:'var(--paper-2)', textAlign:'center' }}>
        <div className="serif italic" style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.3, maxWidth: 800, margin: '0 auto', color:'var(--ink)' }}>
          "Encontraron exactamente la casa que buscábamos sin que pudiéramos describirla. Eso es magia, o muy buen oído."
        </div>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', marginTop: 20, color:'var(--ink-soft)' }}>— REGINA & DAVID · CASA EL REFUGIO</div>
      </div>

      {/* Map + CTA */}
      <div style={{ position:'relative', height: 360 }}>
        <Placeholder h={360} label="MAPA · QUERÉTARO" tone="neutral"/>
        <div style={{ position:'absolute', top: 50, left: 50, background:'var(--paper)', padding: 30, maxWidth: 360, boxShadow:'0 12px 30px rgba(0,0,0,.12)' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>VISÍTANOS</div>
          <div className="display" style={{ fontSize: 28, marginTop: 8, lineHeight: 1.1 }}>Av. Constituyentes 218</div>
          <div className="sans" style={{ fontSize: 13, color:'var(--ink-soft)', marginTop: 8 }}>Querétaro, Qro. · L–V 9–19h</div>
          <div className="mono" style={{ fontSize: 12, marginTop: 16 }}>442 · 318 · 04 22</div>
        </div>
      </div>

      <Foot/>
    </div>
  );
}

// ── Variant 2 · Tipográfico (manifiesto puro) ─────────────────
function HomeTypographic({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      <div style={{ padding:'80px 60px 40px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.24em', color:'var(--terracotta)' }}>INMOBILIARIA · QUERÉTARO · DESDE 2010</div>
        <div className="display" style={{ fontSize: 140, fontWeight: 300, lineHeight: .92, marginTop: 30, letterSpacing:'-0.025em' }}>
          No vendemos<br/>casas. <span style={{ fontStyle:'italic', color:'var(--terracotta)' }}>Abrimos</span><br/>puertas.
        </div>
        <div className="sans" style={{ fontSize: 16, color:'var(--ink-soft)', marginTop: 40, maxWidth: 520, lineHeight: 1.55 }}>
          187 propiedades · 12 desarrollos · 15 años · Querétaro, San Miguel y Tequisquiapan.
        </div>
      </div>

      {/* Inline search */}
      <div style={{ padding:'30px 60px', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', display:'flex', gap: 30, alignItems:'baseline' }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing:'.18em', color:'var(--terracotta)' }}>BUSCAR →</span>
        <span className="display" style={{ fontSize: 22, fontWeight: 300 }}>Quiero <u style={{ textDecorationColor:'var(--terracotta)', textUnderlineOffset: 6 }}>una casa</u> en <u style={{ textDecorationColor:'var(--terracotta)', textUnderlineOffset: 6 }}>Querétaro</u> entre <u style={{ textDecorationColor:'var(--terracotta)', textUnderlineOffset: 6 }}>5 y 15M</u>.</span>
        <span className="mono" style={{ fontSize: 11, letterSpacing:'.18em', marginLeft:'auto' }}>VER 23 RESULTADOS →</span>
      </div>

      {/* Listings as a table */}
      <div style={{ padding:'40px 60px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--ink-soft)' }}>PROPIEDADES DESTACADAS · 04</div>
        <div style={{ marginTop: 20 }}>
          {[
            ['Casa Constituyentes','Querétaro','320 m²','$14,800,000','NB-204'],
            ['Loft El Refugio','San Miguel','110 m²','$5,400,000','NB-217'],
            ['Hacienda Los Olivos','Tequisquiapan','1,400 m²','$28,000,000','NB-189'],
            ['Penthouse Júpiter','Querétaro','240 m²','$11,200,000','NB-241'],
          ].map((row,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 80px', gap: 20, padding:'24px 0', borderTop:'1px solid var(--line)', alignItems:'center' }}>
              <div>
                <div className="display" style={{ fontSize: 28, fontWeight: 400 }}>{row[0]}</div>
              </div>
              <div className="sans" style={{ fontSize: 13, color:'var(--ink-soft)' }}>{row[1]}</div>
              <div className="mono" style={{ fontSize: 12 }}>{row[2]}</div>
              <div className="display italic" style={{ fontSize: 22, color:'var(--terracotta)' }}>{row[3]}</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing:'.16em', color:'var(--ink-soft)' }}>{row[4]}</div>
              <Placeholder h={80} label="" tone="neutral"/>
            </div>
          ))}
        </div>
      </div>

      {/* Categories as inline links */}
      <div style={{ padding:'80px 60px', borderTop:'1px solid var(--line)' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>EXPLORA POR CATEGORÍA</div>
        <div className="display" style={{ fontSize: 64, fontWeight: 300, lineHeight: 1.05, marginTop: 16 }}>
          <span style={{ borderBottom:'1px solid var(--ink)' }}>Residencial</span>{' '}<span style={{ color:'var(--ink-soft)' }}>·</span>{' '}
          <span style={{ borderBottom:'1px solid var(--ink)' }}>Comercial</span>{' '}<span style={{ color:'var(--ink-soft)' }}>·</span>{' '}
          <span style={{ borderBottom:'1px solid var(--ink)' }}>Desarrollos</span>{' '}<span style={{ color:'var(--ink-soft)' }}>·</span>{' '}
          <span style={{ borderBottom:'1px solid var(--ink)' }}>Terrenos</span>{' '}<span style={{ color:'var(--ink-soft)' }}>·</span>{' '}
          <span style={{ borderBottom:'1px solid var(--ink)' }}>Renta</span>
        </div>
      </div>

      {/* Testimonial */}
      <div style={{ padding:'60px', background:'var(--ink)', color:'var(--paper)' }}>
        <div className="serif italic" style={{ fontSize: 44, lineHeight: 1.25, color:'#c89968', maxWidth: 900 }}>
          "Encontraron exactamente la casa que buscábamos sin que pudiéramos describirla."
        </div>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', marginTop: 20, opacity:.7 }}>— REGINA & DAVID</div>
      </div>

      <Foot dark/>
    </div>
  );
}

// ── Variant 3 · Asimétrico / experimental ─────────────────────
function HomeAsymmetric({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', minHeight: 640 }}>
        <div style={{ padding:'80px 50px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.24em', color:'var(--terracotta)' }}>NB · MMXXVI · ESTÍO</div>
            <div className="display" style={{ fontSize: 96, fontWeight: 300, lineHeight: .95, marginTop: 26, letterSpacing:'-0.02em' }}>
              Un lugar<br/>entre <span style={{ fontStyle:'italic', color:'var(--terracotta)' }}>cielo</span><br/>y tierra.
            </div>
          </div>
          {/* Inline search */}
          <div style={{ marginTop: 30, border:'1px solid var(--ink)', padding: 20 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', color:'var(--ink-soft)' }}>QUIERO ENCONTRAR</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14, marginTop: 12 }}>
              <div>
                <div className="display italic" style={{ fontSize: 22, color:'var(--terracotta)' }}>una casa ▾</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)', marginTop: 4 }}>TIPO</div>
              </div>
              <div>
                <div className="display italic" style={{ fontSize: 22, color:'var(--terracotta)' }}>en Querétaro ▾</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)', marginTop: 4 }}>UBICACIÓN</div>
              </div>
              <div>
                <div className="display italic" style={{ fontSize: 22, color:'var(--terracotta)' }}>5–15M ▾</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)', marginTop: 4 }}>PRESUPUESTO</div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="mono" style={{ fontSize: 11, color:'var(--ink-soft)' }}>23 propiedades coinciden</span>
              <span className="mono" style={{ fontSize: 11, letterSpacing:'.16em' }}>VER →</span>
            </div>
          </div>
        </div>
        <Placeholder h="100%" label="HERO · INTERIOR FOTOGRAFÍA" tone="dark"/>
      </div>

      {/* Featured — staggered */}
      <div style={{ padding:'80px 50px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>01 · ESTA SEMANA</div>
        <div className="display" style={{ fontSize: 56, fontWeight: 300, marginTop: 10, letterSpacing:'-0.015em' }}>Cuatro propiedades.</div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap: 20, marginTop: 40 }}>
          <div style={{ gridColumn:'1 / 7' }}>
            <Placeholder h={420} label="PROP · NB-204" tone="neutral"/>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop: 14 }}>
              <div>
                <div className="display" style={{ fontSize: 28 }}>Casa Constituyentes</div>
                <div className="sans" style={{ fontSize: 12, color:'var(--ink-soft)' }}>Querétaro · 320 m² · 4 rec</div>
              </div>
              <div className="display italic" style={{ fontSize: 22, color:'var(--terracotta)' }}>$14.8M</div>
            </div>
          </div>
          <div style={{ gridColumn:'8 / 13', paddingTop: 80 }}>
            <Placeholder h={300} label="PROP · NB-217" tone="terra"/>
            <div style={{ marginTop: 14 }}>
              <div className="display" style={{ fontSize: 22 }}>Loft El Refugio</div>
              <div className="sans" style={{ fontSize: 12, color:'var(--ink-soft)' }}>San Miguel · 110 m²</div>
              <div className="display italic" style={{ fontSize: 18, color:'var(--terracotta)', marginTop: 4 }}>$5.4M</div>
            </div>
          </div>
          <div style={{ gridColumn:'1 / 5', paddingTop: 30 }}>
            <Placeholder h={260} label="PROP · NB-189" tone="neutral"/>
            <div className="display" style={{ fontSize: 20, marginTop: 10 }}>Hacienda Los Olivos</div>
            <div className="display italic" style={{ fontSize: 16, color:'var(--terracotta)' }}>$28M</div>
          </div>
          <div style={{ gridColumn:'6 / 13' }}>
            <Placeholder h={300} label="PROP · NB-241" tone="dark"/>
            <div className="display" style={{ fontSize: 22, marginTop: 10 }}>Penthouse Júpiter</div>
            <div className="sans" style={{ fontSize: 12, color:'var(--ink-soft)' }}>Querétaro · 240 m²</div>
            <div className="display italic" style={{ fontSize: 18, color:'var(--terracotta)' }}>$11.2M</div>
          </div>
        </div>
      </div>

      {/* Categories as a horizontal band */}
      <div style={{ background:'var(--ocre)', padding: 50, display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: 30, alignItems:'end' }}>
        {[['Residencial','78'],['Comercial','42'],['Desarrollos','12'],['Terrenos','55']].map(([t,n],i)=>(
          <div key={i} style={{ borderTop:'1px solid var(--ink)', paddingTop: 14 }}>
            <div className="display" style={{ fontSize: 64, fontWeight: 300, lineHeight: 1, fontStyle:'italic' }}>{n}</div>
            <div className="display" style={{ fontSize: 22, marginTop: 6 }}>{t}</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', marginTop: 10 }}>EXPLORAR →</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ padding:'80px 50px', display:'grid', gridTemplateColumns:'2fr 3fr', gap: 60 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>02 · NOSOTROS</div>
        <div>
          <div className="display" style={{ fontSize: 48, fontWeight: 300, lineHeight: 1.05 }}>
            Quince años abriendo puertas en el Bajío.
          </div>
          <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 18, lineHeight: 1.6, maxWidth: 540 }}>
            Somos una inmobiliaria pequeña, intencional. Trabajamos con menos clientes, más a fondo. Cada propiedad pasa por nuestras manos antes de pasar por las tuyas.
          </div>
        </div>
      </div>

      {/* Testimonial + Map */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
        <div style={{ padding: 50, background:'var(--ink)', color:'var(--paper)', display:'flex', flexDirection:'column', justifyContent:'center', minHeight: 360 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'#c89968' }}>TESTIMONIO</div>
          <div className="serif italic" style={{ fontSize: 28, lineHeight: 1.3, marginTop: 14 }}>
            "Encontraron la casa que buscábamos sin que supiéramos describirla."
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', marginTop: 16, opacity:.6 }}>— REGINA & DAVID</div>
        </div>
        <div style={{ position:'relative', minHeight: 360 }}>
          <Placeholder h={360} label="MAPA · QUERÉTARO" tone="neutral"/>
          <div style={{ position:'absolute', bottom: 20, left: 20, background:'var(--terracotta)', color:'var(--paper)', padding:'8px 14px' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.16em' }}>CONSTITUYENTES · 218</div>
          </div>
        </div>
      </div>

      <Foot/>
    </div>
  );
}

Object.assign(window, { HomeEditorial, HomeTypographic, HomeAsymmetric, Nav, Foot });
