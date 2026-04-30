// Hi-fi inner pages: list, detail, about, contact.

function PageList({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      <div style={{ padding:'40px 50px 20px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>INICIO · PROPIEDADES</div>
        <div className="display" style={{ fontSize: 56, fontWeight: 300, marginTop: 8, letterSpacing:'-0.015em' }}>Propiedades</div>
        <div className="sans" style={{ fontSize: 13, color:'var(--ink-soft)', marginTop: 8 }}>187 disponibles · Querétaro y Bajío</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap: 0, borderTop:'1px solid var(--line)' }}>
        <div style={{ padding: 30, borderRight:'1px solid var(--line)' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--ink-soft)' }}>FILTRAR</div>
          {[
            ['Tipo',['Casa','Departamento','Loft','Hacienda']],
            ['Operación',['Venta','Renta']],
            ['Ubicación',['Querétaro','San Miguel','Tequisquiapan']],
            ['Recámaras',['1+','2+','3+','4+']],
            ['Precio',['< 5M','5–15M','15–30M','> 30M']],
          ].map(([t,opts])=>(
            <div key={t} style={{ marginTop: 24, paddingBottom: 16, borderBottom:'1px solid var(--line-soft)' }}>
              <div className="display" style={{ fontSize: 18, marginBottom: 10 }}>{t}</div>
              {opts.map(o=>(
                <div key={o} style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 12, height: 12, border:'1px solid var(--ink)', borderRadius: 2 }}/>
                  <span className="sans" style={{ fontSize: 12 }}>{o}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: 30 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 11, color:'var(--ink-soft)' }}>187 RESULTADOS</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing:'.14em' }}>ORDENAR · RELEVANCIA ▾</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 24 }}>
            {Array.from({length: 9}).map((_,i)=>(
              <div key={i}>
                <Placeholder h={220} label={`NB-${201+i}`} tone={i%4===2?'terra':'neutral'}/>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.16em', color:'var(--ink-soft)', marginTop: 10 }}>NB-{201+i} · {['VENTA','RENTA','VENTA','VENTA','RENTA','VENTA'][i%6]}</div>
                <div className="display" style={{ fontSize: 20, marginTop: 4 }}>{['Casa','Loft','Penthouse','Hacienda','Depto.','Casa'][i%6]} #{i+1}</div>
                <div className="sans" style={{ fontSize: 12, color:'var(--ink-soft)' }}>Querétaro · {120+i*30} m²</div>
                <div className="display italic" style={{ fontSize: 18, marginTop: 4, color:'var(--terracotta)' }}>${(4+i*1.5).toFixed(1)}M MXN</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap: 14, marginTop: 40, paddingTop: 20, borderTop:'1px solid var(--line)' }}>
            {['1','2','3','…','21'].map((n,i)=>(
              <div key={i} className="mono" style={{ fontSize: 12, padding:'6px 10px', background: i===0?'var(--ink)':'transparent', color: i===0?'var(--paper)':'var(--ink)' }}>{n}</div>
            ))}
          </div>
        </div>
      </div>
      <Foot/>
    </div>
  );
}

function PageDetail({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      <div style={{ padding:'24px 50px 0' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', color:'var(--ink-soft)' }}>INICIO · PROPIEDADES · QUERÉTARO · NB-204</div>
      </div>
      {/* Gallery */}
      <div style={{ padding: '20px 50px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gridTemplateRows:'1fr 1fr', gap: 10, height: 540 }}>
        <div style={{ gridRow:'1 / 3' }}><Placeholder h="100%" label="HERO · NB-204" tone="dark"/></div>
        <Placeholder h="100%" label="" tone="neutral"/>
        <Placeholder h="100%" label="" tone="terra"/>
        <Placeholder h="100%" label="" tone="neutral"/>
        <div style={{ position:'relative' }}>
          <Placeholder h="100%" label="" tone="neutral"/>
          <div style={{ position:'absolute', inset: 0, background:'rgba(26,22,18,.55)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--paper)' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing:'.18em' }}>+ 18 FOTOS</div>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div style={{ padding:'40px 50px', display:'grid', gridTemplateColumns:'2fr 1fr', gap: 50 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>NB-204 · EN VENTA</div>
          <div className="display" style={{ fontSize: 56, fontWeight: 300, marginTop: 8, lineHeight: 1.05, letterSpacing:'-0.015em' }}>Casa Constituyentes</div>
          <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 6 }}>Av. Constituyentes 218 · Querétaro, Qro.</div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 14, marginTop: 30, paddingTop: 24, borderTop:'1px solid var(--line)' }}>
            {[['320','M² CONSTRUIDOS'],['4','RECÁMARAS'],['3.5','BAÑOS'],['2','ESTACIONAM.'],['2018','AÑO']].map(([n,l],i)=>(
              <div key={i}>
                <div className="display" style={{ fontSize: 32, fontWeight: 400 }}>{n}</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', color:'var(--ink-soft)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>SOBRE LA PROPIEDAD</div>
            <div className="serif italic" style={{ fontSize: 26, lineHeight: 1.3, marginTop: 14, color:'var(--ink)', maxWidth: 600 }}>
              Una casa hecha para escuchar la lluvia. Tres niveles, patio interior, ventanales hacia el oriente.
            </div>
            <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 18, lineHeight: 1.65, maxWidth: 600 }}>
              Construida en 2018 por el estudio de arquitectura Lerma & Asociados, esta residencia combina materiales nobles — piedra cantera, madera de mezquite, acero patinado — con una distribución pensada para la vida cotidiana. La planta baja se abre completamente hacia el patio, conectando sala, comedor y cocina en un solo gesto.
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>AMENIDADES</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12, marginTop: 14 }}>
              {['Patio interior','Roof garden','Cuarto de servicio','Cisterna 5,000 L','Pisos radiantes','Domótica','Alberca','Bodega','Estudio'].map(a=>(
                <div key={a} style={{ display:'flex', alignItems:'center', gap: 10, padding:'10px 0', borderBottom:'1px dotted var(--line)' }}>
                  <div style={{ width: 6, height: 6, background:'var(--terracotta)' }}/>
                  <span className="sans" style={{ fontSize: 13 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky sidebar */}
        <div>
          <div style={{ background:'var(--ink)', color:'var(--paper)', padding: 30 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing:'.22em', color:'#c89968' }}>PRECIO</div>
            <div className="display" style={{ fontSize: 44, fontWeight: 300, marginTop: 8, fontStyle:'italic' }}>$14,800,000</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing:'.18em', opacity:.65 }}>MXN · NEGOCIABLE</div>
            <div style={{ marginTop: 24, padding: 20, background:'var(--terracotta)', color:'var(--paper)' }}>
              <div className="display" style={{ fontSize: 18, marginBottom: 8 }}>Solicitar visita</div>
              <div style={{ display:'flex', flexDirection:'column', gap: 8, marginTop: 10 }}>
                <div style={{ background:'rgba(240,235,227,.15)', padding:'10px 12px', fontFamily:'Geist', fontSize: 12 }}>Tu nombre</div>
                <div style={{ background:'rgba(240,235,227,.15)', padding:'10px 12px', fontFamily:'Geist', fontSize: 12 }}>Correo o WhatsApp</div>
                <div style={{ background:'var(--paper)', color:'var(--ink)', padding:'12px', fontFamily:'Geist', fontSize: 13, textAlign:'center', letterSpacing:'.04em' }}>Agendar →</div>
              </div>
            </div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop:'1px solid rgba(240,235,227,.15)', display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius:'50%', background:'#c89968' }}/>
              <div>
                <div className="sans" style={{ fontSize: 13 }}>María Fernanda Aguilar</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.14em', opacity:.65 }}>ASESORA · 442 318 04 22</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: 16, border:'1px solid var(--line)' }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing:'.18em', color:'var(--ink-soft)' }}>UBICACIÓN</div>
            <Placeholder h={140} label="MAPA" tone="neutral"/>
          </div>
        </div>
      </div>
      <Foot/>
    </div>
  );
}

function PageAbout({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      <div style={{ padding:'80px 50px 60px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.24em', color:'var(--terracotta)' }}>NOSOTROS</div>
        <div className="display" style={{ fontSize: 96, fontWeight: 300, lineHeight: .98, marginTop: 24, letterSpacing:'-0.02em', maxWidth: 1000 }}>
          Quince años <span style={{ fontStyle:'italic', color:'var(--terracotta)' }}>abriendo</span> puertas<br/>en el Bajío.
        </div>
      </div>
      <Placeholder h={420} label="OFICINA · QUERÉTARO · 2024" tone="neutral"/>
      <div style={{ padding:'80px 50px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 30 }}>
        {[['Misión','Acompañar a quienes buscan un espacio — para vivir, trabajar, invertir — con honestidad, criterio y tiempo dedicado.'],
          ['Visión','Ser la inmobiliaria de referencia del Bajío para quien valora hacer las cosas con cuidado, no con prisa.'],
          ['Valores','Discreción · transparencia en cifras · respeto al tiempo del cliente · obsesión por los detalles.']].map(([t,d])=>(
          <div key={t} style={{ borderTop:'1px solid var(--ink)', paddingTop: 18 }}>
            <div className="display" style={{ fontSize: 32, fontWeight: 400 }}>{t}</div>
            <div className="sans" style={{ fontSize: 14, color:'var(--ink-soft)', marginTop: 14, lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'40px 50px 80px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.22em', color:'var(--terracotta)' }}>EQUIPO · 8</div>
        <div className="display" style={{ fontSize: 56, fontWeight: 300, marginTop: 10 }}>Las personas detrás.</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 24, marginTop: 40 }}>
          {[
            ['María Fernanda Aguilar','Directora general'],
            ['Andrés Solís','Asesor sr. · residencial'],
            ['Lucía Torres','Asesora · comercial'],
            ['Rafael Ibáñez','Desarrollos & inversión'],
          ].map(([n,r])=>(
            <div key={n}>
              <Placeholder h={300} label="" tone="neutral"/>
              <div className="display" style={{ fontSize: 20, marginTop: 14 }}>{n}</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing:'.16em', color:'var(--ink-soft)', marginTop: 4 }}>{r.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <Foot/>
    </div>
  );
}

function PageContact({ width=1280 }) {
  return (
    <div style={{ width, background:'var(--paper)' }}>
      <Nav/>
      <div style={{ padding:'80px 50px 40px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing:'.24em', color:'var(--terracotta)' }}>CONTACTO</div>
        <div className="display" style={{ fontSize: 110, fontWeight: 300, lineHeight: 1, marginTop: 18, letterSpacing:'-0.02em' }}>
          <span style={{ fontStyle:'italic' }}>Hablemos</span>.
        </div>
        <div className="sans" style={{ fontSize: 16, color:'var(--ink-soft)', marginTop: 18, maxWidth: 540, lineHeight: 1.6 }}>
          Cuéntanos qué buscas — nosotros nos encargamos de filtrar el ruido. Te respondemos en menos de 24 horas, prometido.
        </div>
      </div>
      <div style={{ padding:'40px 50px 80px', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 60 }}>
        <div>
          {[['Nombre','María Pérez'],['Correo','tu@correo.mx'],['Teléfono','+52 442 ...'],['Asunto','Quiero comprar / vender / rentar']].map(([f,p])=>(
            <div key={f} style={{ marginBottom: 18, borderBottom:'1px solid var(--ink)', paddingBottom: 8 }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing:'.18em', color:'var(--terracotta)' }}>{f.toUpperCase()}</div>
              <div className="display" style={{ fontSize: 22, fontWeight: 300, marginTop: 6, color:'var(--ink-soft)' }}>{p}</div>
            </div>
          ))}
          <div style={{ marginBottom: 18, borderBottom:'1px solid var(--ink)', paddingBottom: 8 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing:'.18em', color:'var(--terracotta)' }}>MENSAJE</div>
            <div className="display" style={{ fontSize: 22, fontWeight: 300, marginTop: 6, color:'var(--ink-soft)', height: 80 }}>Cuéntanos lo que tengas en mente...</div>
          </div>
          <div style={{ display:'inline-block', marginTop: 18, background:'var(--ink)', color:'var(--paper)', padding:'18px 40px' }}>
            <span className="display" style={{ fontSize: 22, fontStyle:'italic' }}>Enviar</span>{' '}<span className="mono" style={{ fontSize: 12, letterSpacing:'.16em' }}>→</span>
          </div>
        </div>
        <div>
          <Placeholder h={300} label="MAPA · CONSTITUYENTES 218" tone="neutral"/>
          <div style={{ marginTop: 24 }}>
            {[['OFICINA','Av. Constituyentes 218\nQuerétaro, Qro. 76000'],
              ['HORARIO','Lunes a viernes\n9:00 — 19:00 h'],
              ['DIRECTO','442 · 318 · 04 22\nhola@nubia.mx']].map(([t,d])=>(
              <div key={t} style={{ marginBottom: 18, paddingBottom: 14, borderBottom:'1px dotted var(--line)' }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing:'.18em', color:'var(--ink-soft)' }}>{t}</div>
                <div className="display" style={{ fontSize: 20, marginTop: 6, whiteSpace:'pre-line', lineHeight: 1.3 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Foot/>
    </div>
  );
}

Object.assign(window, { PageList, PageDetail, PageAbout, PageContact });
