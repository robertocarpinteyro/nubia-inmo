// Wireframes — low-fi, b&w, sketchy vibe. One per page.

const wfStyle = {
  font: "'Caveat', 'Marker Felt', cursive",
  ink: '#2a2520',
  line: '#2a2520',
  fill: '#e8e4dc',
  accent: '#b85c3c',
};

const Box = ({ w='100%', h=80, label, children, style={}, dashed=false }) => (
  <div style={{
    width: w, height: h, border: `${dashed ? '1.5px dashed' : '1.5px solid'} ${wfStyle.line}`,
    borderRadius: 4, padding: 8, position:'relative', boxSizing:'border-box',
    fontFamily: wfStyle.font, color: wfStyle.ink, fontSize: 16, ...style
  }}>
    {label && <div style={{ position:'absolute', top: 4, left: 8, fontSize: 14, opacity:.7 }}>{label}</div>}
    {children}
  </div>
);

const Scribble = ({ lines = 3, w = '100%' }) => (
  <div style={{ width: w, display:'flex', flexDirection:'column', gap: 4, marginTop: 6 }}>
    {Array.from({length: lines}).map((_,i)=>(
      <div key={i} style={{ height: 2, background: wfStyle.line, opacity:.5, width: `${[100,85,70,90,60][i%5]}%` }}/>
    ))}
  </div>
);

const WFNav = () => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:`1.5px solid ${wfStyle.line}`, fontFamily: wfStyle.font, fontSize: 16 }}>
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, border:`1.5px solid ${wfStyle.line}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>N</div>
      <span style={{ fontSize: 18 }}>nubia</span>
    </div>
    <div style={{ display:'flex', gap: 18 }}>
      <span>Propiedades</span><span>Desarrollos</span><span>Nosotros</span><span>Contacto</span>
    </div>
    <div style={{ border:`1.5px solid ${wfStyle.line}`, padding:'4px 14px', borderRadius: 99 }}>Acceder</div>
  </div>
);

const WFFoot = () => (
  <div style={{ borderTop:`1.5px solid ${wfStyle.line}`, padding:'16px 20px', fontFamily: wfStyle.font, fontSize: 14, opacity:.7 }}>
    Footer · contacto · redes · legal
  </div>
);

function WireHome({ width=1080, height=720 }) {
  return (
    <div style={{ width, height, background: wfStyle.fill, fontFamily: wfStyle.font, color: wfStyle.ink, overflow:'hidden' }}>
      <WFNav/>
      <div style={{ padding: 20, display:'flex', flexDirection:'column', gap: 14 }}>
        <Box h={180} label="HERO + buscador" dashed>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.1, textAlign:'center' }}>"un lugar entre cielo y tierra"</div>
          <div style={{ display:'flex', justifyContent:'center', gap: 8, marginTop: 14 }}>
            <Box w={140} h={36} label=""><div style={{ paddingTop: 10, textAlign:'center', fontSize:13 }}>Tipo ▾</div></Box>
            <Box w={140} h={36}><div style={{ paddingTop: 10, textAlign:'center', fontSize:13 }}>Ubicación ▾</div></Box>
            <Box w={120} h={36}><div style={{ paddingTop: 10, textAlign:'center', fontSize:13 }}>Precio ▾</div></Box>
            <Box w={100} h={36} style={{ background: wfStyle.line, color: wfStyle.fill }}><div style={{ paddingTop: 10, textAlign:'center', fontSize:13 }}>Buscar →</div></Box>
          </div>
        </Box>
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 14, marginBottom: 6 }}>
            <span>Propiedades destacadas</span><span style={{ opacity:.6 }}>ver todas →</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10 }}>
            {[1,2,3,4].map(i=>(
              <Box key={i} h={140}>
                <div style={{ height: 80, background:`repeating-linear-gradient(45deg, ${wfStyle.line} 0, ${wfStyle.line} 1px, transparent 1px, transparent 8px)`, opacity:.3, marginTop:14 }}/>
                <div style={{ fontSize: 13, marginTop: 6 }}>Casa #{i}</div>
                <div style={{ fontSize: 11, opacity:.6 }}>$X,XXX,XXX MXN</div>
              </Box>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 10 }}>
          <Box h={100}><div style={{ paddingTop: 30, textAlign:'center', fontSize: 18 }}>Residencial</div></Box>
          <Box h={100}><div style={{ paddingTop: 30, textAlign:'center', fontSize: 18 }}>Comercial</div></Box>
          <Box h={100}><div style={{ paddingTop: 30, textAlign:'center', fontSize: 18 }}>Desarrollos</div></Box>
        </div>
        <Box h={80} label="Sobre nosotros" dashed><Scribble lines={3}/></Box>
      </div>
      <WFFoot/>
    </div>
  );
}

function WireList({ width=1080, height=720 }) {
  return (
    <div style={{ width, height, background: wfStyle.fill, fontFamily: wfStyle.font, color: wfStyle.ink, overflow:'hidden' }}>
      <WFNav/>
      <div style={{ display:'flex', height: height - 110 }}>
        <div style={{ width: 240, padding: 16, borderRight:`1.5px solid ${wfStyle.line}` }}>
          <div style={{ fontSize: 14, marginBottom: 10 }}>Filtros</div>
          {['Tipo','Ubicación','Precio','Recámaras','Baños','Metros','Amenidades'].map(f=>(
            <Box key={f} h={40} style={{ marginBottom: 6 }}><div style={{ fontSize: 13, paddingTop: 8 }}>{f} ▾</div></Box>
          ))}
        </div>
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 14, marginBottom: 10 }}>
            <span>187 propiedades</span><span style={{ opacity:.6 }}>Ordenar: relevancia ▾</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 10 }}>
            {Array.from({length: 9}).map((_,i)=>(
              <Box key={i} h={150}>
                <div style={{ height: 80, background:`repeating-linear-gradient(45deg, ${wfStyle.line} 0, ${wfStyle.line} 1px, transparent 1px, transparent 8px)`, opacity:.3, marginTop:14 }}/>
                <div style={{ fontSize: 12, marginTop: 4 }}>Propiedad #{i+1}</div>
              </Box>
            ))}
          </div>
        </div>
      </div>
      <WFFoot/>
    </div>
  );
}

function WireDetail({ width=1080, height=720 }) {
  return (
    <div style={{ width, height, background: wfStyle.fill, fontFamily: wfStyle.font, color: wfStyle.ink, overflow:'hidden' }}>
      <WFNav/>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 12, opacity:.6, marginBottom: 6 }}>Inicio › Propiedades › Querétaro › Casa Constituyentes</div>
        <Box h={260} dashed>
          <div style={{ display:'flex', gap: 8, height: '100%' }}>
            <Box h="100%" w="60%"><div style={{ paddingTop: 100, textAlign:'center', fontSize: 16 }}>Galería principal</div></Box>
            <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 8 }}>
              <Box h="100%"/><Box h="100%"/><Box h="100%"/>
            </div>
          </div>
        </Box>
        <div style={{ display:'flex', gap: 16, marginTop: 14 }}>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 24 }}>Casa Constituyentes</div>
            <div style={{ fontSize: 14, opacity:.7 }}>Querétaro, Qro. · 320m² · 4 rec · 3.5 baños</div>
            <Scribble lines={5}/>
            <div style={{ display:'flex', gap: 14, marginTop: 14, fontSize: 13 }}>
              {['Recámaras','Baños','Metros','Estac.','Antigüedad'].map(s=>(
                <Box key={s} w={80} h={60}><div style={{ paddingTop: 18, textAlign:'center', fontSize: 12 }}>{s}</div></Box>
              ))}
            </div>
          </div>
          <Box h={260} w={300}>
            <div style={{ fontSize: 22, marginTop: 6 }}>$14,800,000 MXN</div>
            <div style={{ fontSize: 12, opacity:.7, marginTop: 4 }}>Ref · NB-204</div>
            <div style={{ marginTop: 14, padding:'10px 0', textAlign:'center', background: wfStyle.line, color: wfStyle.fill, fontSize: 14, borderRadius: 4 }}>Solicitar visita</div>
            <Scribble lines={4}/>
          </Box>
        </div>
      </div>
    </div>
  );
}

function WireAbout({ width=1080, height=720 }) {
  return (
    <div style={{ width, height, background: wfStyle.fill, fontFamily: wfStyle.font, color: wfStyle.ink, overflow:'hidden' }}>
      <WFNav/>
      <div style={{ padding: 30 }}>
        <div style={{ fontSize: 36, lineHeight: 1.1, maxWidth: 700 }}>"un lugar entre cielo y tierra"</div>
        <Scribble lines={5} w="60%"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 14, marginTop: 30 }}>
          {['Misión','Visión','Valores'].map(s=>(
            <Box key={s} h={140}><div style={{ fontSize: 18, marginTop: 6 }}>{s}</div><Scribble lines={3}/></Box>
          ))}
        </div>
        <div style={{ fontSize: 22, marginTop: 30 }}>Equipo</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14, marginTop: 10 }}>
          {[1,2,3,4].map(i=>(
            <Box key={i} h={160}>
              <div style={{ width: 60, height: 60, borderRadius:'50%', border:`1.5px solid ${wfStyle.line}`, marginTop: 8 }}/>
              <div style={{ fontSize: 14, marginTop: 6 }}>Asesor #{i}</div>
              <div style={{ fontSize: 12, opacity:.7 }}>Cargo</div>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}

function WireContact({ width=1080, height=720 }) {
  return (
    <div style={{ width, height, background: wfStyle.fill, fontFamily: wfStyle.font, color: wfStyle.ink, overflow:'hidden' }}>
      <WFNav/>
      <div style={{ padding: 30, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 30 }}>
        <div>
          <div style={{ fontSize: 36 }}>Hablemos.</div>
          <Scribble lines={3} w="80%"/>
          {['Nombre','Correo','Teléfono','Mensaje'].map(f=>(
            <Box key={f} h={f==='Mensaje'?100:44} style={{ marginTop: 10 }}><div style={{ fontSize: 13, opacity:.6 }}>{f}</div></Box>
          ))}
          <Box h={44} style={{ marginTop: 14, background: wfStyle.line, color: wfStyle.fill }}><div style={{ paddingTop: 14, textAlign:'center' }}>Enviar →</div></Box>
        </div>
        <div>
          <Box h={300} dashed><div style={{ paddingTop: 130, textAlign:'center', fontSize: 18 }}>MAPA</div></Box>
          <div style={{ fontSize: 16, marginTop: 14 }}>Av. Constituyentes 218</div>
          <div style={{ fontSize: 14, opacity:.7 }}>Querétaro, Qro. · 442 318 04 22</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WireHome, WireList, WireDetail, WireAbout, WireContact });
