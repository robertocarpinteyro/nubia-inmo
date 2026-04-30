// Web layout — main app combining wireframes + hi-fi pages.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "logoVariant": "cinta",
  "primary": "terracotta",
  "displayFont": "fraunces",
  "dark": false,
  "density": "comfortable"
}/*EDITMODE-END*/;

const FONT_MAP = {
  fraunces: "'Fraunces', Georgia, serif",
  instrument: "'Instrument Serif', Georgia, serif",
  geist: "'Geist', system-ui, sans-serif",
};
const ACCENT_MAP = {
  terracotta: '#b85c3c',
  ocre: '#c89968',
  ink: '#1a1612',
  salvia: '#8a8779',
};

function WebApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--terracotta', ACCENT_MAP[tweaks.primary] || ACCENT_MAP.terracotta);
    if (tweaks.dark) {
      root.style.setProperty('--paper', '#1a1612');
      root.style.setProperty('--paper-2', '#2c2620');
      root.style.setProperty('--ink', '#f0ebe3');
      root.style.setProperty('--ink-2', '#e6e0d4');
      root.style.setProperty('--ink-soft', '#a89e8c');
      root.style.setProperty('--line', 'rgba(240,235,227,.18)');
      root.style.setProperty('--line-soft', 'rgba(240,235,227,.10)');
    } else {
      root.style.setProperty('--paper', '#f0ebe3');
      root.style.setProperty('--paper-2', '#e6e0d4');
      root.style.setProperty('--ink', '#1a1612');
      root.style.setProperty('--ink-2', '#2c2620');
      root.style.setProperty('--ink-soft', '#6b6258');
      root.style.setProperty('--line', 'rgba(26,22,18,.18)');
      root.style.setProperty('--line-soft', 'rgba(26,22,18,.10)');
    }
    // Apply font swap to .display class
    const styleEl = document.getElementById('font-override') || (() => {
      const s = document.createElement('style'); s.id = 'font-override'; document.head.appendChild(s); return s;
    })();
    styleEl.textContent = `.display { font-family: ${FONT_MAP[tweaks.displayFont]} !important; }`;
  }, [tweaks.primary, tweaks.dark, tweaks.displayFont]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="cover" title="Layout web · Nubia Inmobiliaria" subtitle="Wireframes → mockups hi-fi · 5 páginas, 3 variantes de home">
          <DCArtboard id="cover" label="Sistema" width={1180} height={500}>
            <div style={{ width: 1180, height: 500, padding: 60, background:'var(--paper)', position:'relative' }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing:'.24em', color:'var(--terracotta)' }}>NUBIA · LAYOUT WEB · v1</div>
              <div className="display" style={{ fontSize: 96, fontWeight: 300, lineHeight: .98, marginTop: 24, letterSpacing:'-0.02em' }}>
                Layout web<br/>
                <span style={{ fontStyle:'italic', color:'var(--terracotta)' }}>&amp;</span> sistema de páginas.
              </div>
              <div className="sans" style={{ fontSize: 15, color:'var(--ink-soft)', marginTop: 24, maxWidth: 600, lineHeight: 1.55 }}>
                Cinco páginas — home, listado, detalle, nosotros, contacto — exploradas primero como wireframes b&amp;w y luego con la marca aplicada en tres direcciones distintas. Activa "Tweaks" en la barra para cambiar la paleta, tipografía o modo oscuro.
              </div>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="wires" title="01 · Wireframes" subtitle="Estructura y flujo · b&w">
          <DCArtboard id="wf-home" label="Home" width={1080} height={720}><WireHome/></DCArtboard>
          <DCArtboard id="wf-list" label="Listado" width={1080} height={720}><WireList/></DCArtboard>
          <DCArtboard id="wf-detail" label="Detalle" width={1080} height={720}><WireDetail/></DCArtboard>
          <DCArtboard id="wf-about" label="Nosotros" width={1080} height={720}><WireAbout/></DCArtboard>
          <DCArtboard id="wf-contact" label="Contacto" width={1080} height={720}><WireContact/></DCArtboard>
        </DCSection>

        <DCSection id="hifi-home" title="02 · Home — 3 variantes" subtitle="Editorial · Tipográfico · Asimétrico">
          <DCArtboard id="h1" label="A · Editorial (JamesEdition-style)" width={1280} height={2900}>
            <HomeEditorial/>
          </DCArtboard>
          <DCArtboard id="h2" label="B · Tipográfico (manifiesto)" width={1280} height={2200}>
            <HomeTypographic/>
          </DCArtboard>
          <DCArtboard id="h3" label="C · Asimétrico" width={1280} height={2400}>
            <HomeAsymmetric/>
          </DCArtboard>
        </DCSection>

        <DCSection id="hifi-pages" title="03 · Páginas internas" subtitle="Aplicando la dirección elegida">
          <DCArtboard id="p-list" label="Listado de propiedades" width={1280} height={1800}><PageList/></DCArtboard>
          <DCArtboard id="p-detail" label="Detalle de propiedad" width={1280} height={1900}><PageDetail/></DCArtboard>
          <DCArtboard id="p-about" label="Nosotros" width={1280} height={2000}><PageAbout/></DCArtboard>
          <DCArtboard id="p-contact" label="Contacto" width={1280} height={1400}><PageContact/></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="Marca">
          <TweakSelect label="Color primario" value={tweaks.primary} onChange={v=>setTweak('primary', v)}
            options={[['terracotta','Terracota'],['ocre','Ocre'],['ink','Tinta'],['salvia','Salvia']]}/>
          <TweakSelect label="Tipografía display" value={tweaks.displayFont} onChange={v=>setTweak('displayFont', v)}
            options={[['fraunces','Fraunces'],['instrument','Instrument Serif'],['geist','Geist (sans)']]}/>
        </TweakSection>
        <TweakSection title="Apariencia">
          <TweakToggle label="Modo oscuro" value={tweaks.dark} onChange={v=>setTweak('dark', v)}/>
          <TweakRadio label="Densidad" value={tweaks.density} onChange={v=>setTweak('density', v)}
            options={[['comfortable','Cómoda'],['compact','Compacta']]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WebApp/>);
