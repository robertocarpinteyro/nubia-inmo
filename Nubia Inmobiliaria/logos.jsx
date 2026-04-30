// Logo system for Nubia Inmobiliaria — 5 propuestas originales.

const INK = '#1a1612';
const TERRA = '#b85c3c';
const OCRE = '#c89968';
const PAPER = '#f0ebe3';

// 01 · Arco Horizonte
function LogoArco({ size = 200, mono = false, color = INK, accent = TERRA, showWord = true, layout = 'stack' }) {
  const w = layout === 'horizontal' ? size * 2.6 : size;
  const h = layout === 'horizontal' ? size * 0.9 : size * 1.25;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display:'block' }}>
      {layout === 'stack' ? (
        <>
          <g transform={`translate(${w/2 - size*0.32}, ${size*0.12})`}>
            <path d={`M 0 ${size*0.36} A ${size*0.32} ${size*0.32} 0 0 1 ${size*0.64} ${size*0.36}`}
                  fill="none" stroke={mono ? color : accent} strokeWidth={size*0.055} strokeLinecap="round"/>
            <line x1={-size*0.04} y1={size*0.36} x2={size*0.68} y2={size*0.36}
                  stroke={color} strokeWidth={size*0.022} strokeLinecap="round"/>
          </g>
          {showWord && (
            <text x={w/2} y={size*0.85} textAnchor="middle"
                  fontFamily="Fraunces, Georgia, serif" fontWeight="400"
                  fontSize={size*0.22} letterSpacing={size*0.012} fill={color}>
              NUBIA
            </text>
          )}
          {showWord && (
            <text x={w/2} y={size*1.05} textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace" fontSize={size*0.058}
                  letterSpacing={size*0.022} fill={color} opacity="0.7">
              I N M O B I L I A R I A
            </text>
          )}
        </>
      ) : (
        <>
          <g transform={`translate(${size*0.15}, ${h*0.22})`}>
            <path d={`M 0 ${size*0.5} A ${size*0.35} ${size*0.35} 0 0 1 ${size*0.7} ${size*0.5}`}
                  fill="none" stroke={mono ? color : accent} strokeWidth={size*0.06} strokeLinecap="round"/>
            <line x1={-size*0.04} y1={size*0.5} x2={size*0.74} y2={size*0.5}
                  stroke={color} strokeWidth={size*0.024} strokeLinecap="round"/>
          </g>
          <text x={size*1.05} y={h*0.55} fontFamily="Fraunces, Georgia, serif" fontWeight="400"
                fontSize={size*0.36} fill={color}>Nubia</text>
          <text x={size*1.07} y={h*0.78} fontFamily="JetBrains Mono, monospace"
                fontSize={size*0.085} letterSpacing={size*0.025} fill={color} opacity="0.7">
            INMOBILIARIA
          </text>
        </>
      )}
    </svg>
  );
}

// 02 · Monograma N (umbral)
function LogoMonograma({ size = 200, mono = false, color = INK, accent = TERRA, showWord = true }) {
  const w = size, h = size * 1.3;
  const s = size * 0.42;
  const cx = w/2, cy = size*0.42;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{display:'block'}}>
      <rect x={cx - s/2} y={cy - s/2} width={s} height={s}
            fill="none" stroke={color} strokeWidth={size*0.025}/>
      <line x1={cx - s/2 + size*0.08} y1={cy - s/2 + size*0.06}
            x2={cx - s/2 + size*0.08} y2={cy + s/2 - size*0.06}
            stroke={color} strokeWidth={size*0.035} strokeLinecap="round"/>
      <line x1={cx + s/2 - size*0.08} y1={cy - s/2 + size*0.06}
            x2={cx + s/2 - size*0.08} y2={cy + s/2 - size*0.06}
            stroke={color} strokeWidth={size*0.035} strokeLinecap="round"/>
      <line x1={cx - s/2 + size*0.08} y1={cy - s/2 + size*0.06}
            x2={cx + s/2 - size*0.08} y2={cy + s/2 - size*0.06}
            stroke={mono ? color : accent} strokeWidth={size*0.035} strokeLinecap="round"/>
      {showWord && (
        <>
          <text x={cx} y={size*0.96} textAnchor="middle"
                fontFamily="Fraunces, Georgia, serif" fontSize={size*0.16} fill={color}>
            Nubia
          </text>
          <text x={cx} y={size*1.14} textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize={size*0.052}
                letterSpacing={size*0.022} fill={color} opacity="0.7">
            INMOBILIARIA
          </text>
        </>
      )}
    </svg>
  );
}

// 03 · Wordmark
function LogoWordmark({ size = 200, color = INK, accent = TERRA, mono = false }) {
  const w = size * 2.6, h = size * 1.0;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{display:'block'}}>
      <text x={w/2} y={h*0.55} textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif" fontWeight="300"
            fontSize={size*0.62} fill={color} letterSpacing={size*0.005}>
        Nub
        <tspan fill={mono ? color : accent} fontStyle="italic" fontWeight="400">i</tspan>
        a
      </text>
      <line x1={w*0.22} y1={h*0.68} x2={w*0.78} y2={h*0.68}
            stroke={color} strokeWidth={size*0.012} opacity="0.4"/>
      <text x={w/2} y={h*0.82} textAnchor="middle"
            fontFamily="JetBrains Mono, monospace" fontSize={size*0.085}
            letterSpacing={size*0.06} fill={color} opacity="0.75">
        INMOBILIARIA · MX
      </text>
    </svg>
  );
}

// 04 · Sello
function LogoSello({ size = 220, mono = false, color = INK, accent = TERRA }) {
  const w = size, h = size;
  const r = size * 0.45;
  const cx = w/2, cy = h/2;
  const id = React.useId();
  const pathTop = `M ${cx - r*0.86} ${cy} a ${r*0.86} ${r*0.86} 0 0 1 ${r*1.72} 0`;
  const pathBottom = `M ${cx - r*0.86} ${cy + 2} a ${r*0.86} ${r*0.86} 0 0 0 ${r*1.72} 0`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{display:'block'}}>
      <defs>
        <path id={`top-${id}`} d={pathTop}/>
        <path id={`bot-${id}`} d={pathBottom}/>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={size*0.008}/>
      <circle cx={cx} cy={cy} r={r*0.86} fill="none" stroke={color} strokeWidth={size*0.004} opacity="0.5"/>
      <text fontFamily="JetBrains Mono, monospace" fontSize={size*0.058}
            letterSpacing={size*0.018} fill={color}>
        <textPath href={`#top-${id}`} startOffset="50%" textAnchor="middle">
          NUBIA · INMOBILIARIA
        </textPath>
      </text>
      <text fontFamily="JetBrains Mono, monospace" fontSize={size*0.045}
            letterSpacing={size*0.04} fill={color} opacity="0.65">
        <textPath href={`#bot-${id}`} startOffset="50%" textAnchor="middle">
          ESTABLECIDA · MMXXIV
        </textPath>
      </text>
      <g transform={`translate(${cx - size*0.13}, ${cy - size*0.04})`}>
        <path d={`M 0 ${size*0.13} A ${size*0.13} ${size*0.13} 0 0 1 ${size*0.26} ${size*0.13}`}
              fill="none" stroke={mono ? color : accent} strokeWidth={size*0.025} strokeLinecap="round"/>
        <line x1={-size*0.015} y1={size*0.13} x2={size*0.275} y2={size*0.13}
              stroke={color} strokeWidth={size*0.012} strokeLinecap="round"/>
      </g>
      <circle cx={cx - r*0.86} cy={cy} r={size*0.012} fill={color}/>
      <circle cx={cx + r*0.86} cy={cy} r={size*0.012} fill={color}/>
    </svg>
  );
}

// 05 · Cinta
function LogoCinta({ size = 200, mono = false, color = INK, accent = TERRA, showWord = true }) {
  const w = size * 1.2, h = size * 1.3;
  const baseY = size * 0.45;
  const r = size * 0.13;
  const cx = w/2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{display:'block'}}>
      <g>
        <line x1={cx - size*0.5} y1={baseY} x2={cx + size*0.5} y2={baseY}
              stroke={color} strokeWidth={size*0.022} strokeLinecap="round"/>
        <path d={`M ${cx - size*0.45} ${baseY} a ${r} ${r} 0 0 1 ${r*2} 0`}
              fill="none" stroke={color} strokeWidth={size*0.04} strokeLinecap="round"/>
        <path d={`M ${cx - size*0.13} ${baseY} a ${r*1.05} ${r*1.05} 0 0 1 ${r*2.1} 0`}
              fill="none" stroke={mono ? color : accent} strokeWidth={size*0.04} strokeLinecap="round"/>
        <path d={`M ${cx + size*0.21} ${baseY} a ${r*0.9} ${r*0.9} 0 0 1 ${r*1.8} 0`}
              fill="none" stroke={color} strokeWidth={size*0.04} strokeLinecap="round"/>
      </g>
      {showWord && (
        <>
          <text x={cx} y={size*0.85} textAnchor="middle"
                fontFamily="Fraunces, Georgia, serif" fontWeight="400"
                fontSize={size*0.24} fill={color}>
            Nubia
          </text>
          <text x={cx} y={size*1.06} textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize={size*0.058}
                letterSpacing={size*0.04} fill={color} opacity="0.7">
            BIENES · RAÍCES
          </text>
        </>
      )}
    </svg>
  );
}

Object.assign(window, { LogoArco, LogoMonograma, LogoWordmark, LogoSello, LogoCinta, INK, TERRA, OCRE, PAPER });
