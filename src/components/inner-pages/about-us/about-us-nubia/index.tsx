"use client"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

// ── Constantes de estilo Nubia ────────────────────────────────────────────────
const C = {
   dark:      "#182D40",
   dark2:     "#142537",
   dark3:     "#1D3347",
   gold:      "#D9A76A",
   gold2:     "#E8C08E",
   goldAlpha: "rgba(217,167,106,0.12)",
   blueMid:   "#325573",
   steel:     "#6D7E8C",
   sage:      "#EBF0F5",
   sage2:     "#F2F6FA",
   offWhite:  "#F2F2F2",
   white:     "#FFFFFF",
   border:    "rgba(255,255,255,0.08)",
   border2:   "rgba(255,255,255,0.05)",
}

// ── Stats ────────────────────────────────────────────────────────────────────
const StatsBar = () => {
   const { t } = useLanguage()
   const stats = [
      { number: "15", suffix: "+", label: t("about.statYears") },
      { number: "1,200", suffix: "+", label: t("about.statProperties") },
      { number: "3,500", suffix: "+", label: t("about.statClients") },
      { number: "8", suffix: "", label: t("about.statCities") },
   ]
   return (
      <div
         style={{
            background: C.dark2,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            padding: "64px 0",
         }}
      >
         <div className="container">
            <div
               style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 0,
               }}
               className="nubia-stats-grid"
            >
               {stats.map((s, i) => (
                  <div
                     key={i}
                     style={{
                        padding: "0 40px",
                        borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                        ...(i === 0 ? { paddingLeft: 0 } : {}),
                        ...(i === 3 ? { paddingRight: 0 } : {}),
                     }}
                  >
                     <span
                        style={{
                           fontSize: "clamp(2.5rem, 5vw, 64px)",
                           fontWeight: 900,
                           lineHeight: 1,
                           letterSpacing: "-0.04em",
                           color: C.white,
                           display: "block",
                        }}
                     >
                        {s.number}
                        <span style={{ color: C.gold }}>{s.suffix}</span>
                     </span>
                     <span
                        style={{
                           fontSize: "13px",
                           color: "rgba(255,255,255,0.4)",
                           letterSpacing: "0.1em",
                           textTransform: "uppercase",
                           marginTop: "10px",
                           display: "block",
                        }}
                     >
                        {s.label}
                     </span>
                  </div>
               ))}
            </div>
         </div>

         <style>{`
            @media (max-width: 768px) {
               .nubia-stats-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 32px 0 !important;
               }
               .nubia-stats-grid > div {
                  padding: 0 20px !important;
                  border-right: none !important;
                  border-bottom: 1px solid rgba(255,255,255,0.08);
                  padding-bottom: 32px !important;
               }
               .nubia-stats-grid > div:nth-child(odd) {
                  border-right: 1px solid rgba(255,255,255,0.08) !important;
               }
               .nubia-stats-grid > div:nth-last-child(-n+2) {
                  border-bottom: none !important;
               }
            }
         `}</style>
      </div>
   )
}

// ── Mission Block ────────────────────────────────────────────────────────────
const MissionBlock = () => {
   const { t } = useLanguage()
   return (
      <div
         style={{
            background: C.dark,
            padding: "120px 0",
            position: "relative",
            overflow: "hidden",
         }}
      >
         {/* Grid texture */}
         <div
            style={{
               position: "absolute",
               inset: 0,
               backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
               backgroundSize: "80px 80px",
               pointerEvents: "none",
            }}
         />
         <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div className="row align-items-center g-5">
               {/* Imagen */}
               <div className="col-lg-6">
                  <div
                     style={{
                        borderRadius: "2px",
                        overflow: "hidden",
                        aspectRatio: "4/3",
                        position: "relative",
                     }}
                  >
                     <img
                        src="/assets/images/media/img_52.jpg"
                        alt="Nubia inmobiliaria"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                     />
                     {/* Gold accent bar */}
                     <div
                        style={{
                           position: "absolute",
                           bottom: 0,
                           left: 0,
                           right: 0,
                           height: "4px",
                           background: C.gold,
                        }}
                     />
                  </div>
               </div>

               {/* Texto */}
               <div className="col-lg-6">
                  <div style={{ paddingLeft: "clamp(0px, 4vw, 48px)" }}>
                     <span
                        style={{
                           display: "inline-flex",
                           alignItems: "center",
                           gap: "10px",
                           fontSize: "12px",
                           fontWeight: 700,
                           letterSpacing: "0.2em",
                           textTransform: "uppercase",
                           color: C.gold,
                           marginBottom: "24px",
                        }}
                     >
                        <span style={{ width: "24px", height: "1px", background: C.gold, display: "inline-block" }} />
                        {t("about.missionLabel")}
                     </span>
                     <h2
                        style={{
                           fontSize: "clamp(2.2rem, 5vw, 64px)",
                           fontWeight: 900,
                           lineHeight: 0.92,
                           letterSpacing: "-0.04em",
                           color: C.white,
                           textTransform: "uppercase",
                           marginBottom: "28px",
                        }}
                     >
                        {t("about.missionTitle")}
                     </h2>
                     <p
                        style={{
                           fontSize: "17px",
                           color: "rgba(255,255,255,0.55)",
                           lineHeight: 1.75,
                           maxWidth: "420px",
                           marginBottom: "40px",
                        }}
                     >
                        {t("about.missionBody")}
                     </p>
                     <Link
                        href="/listing_07"
                        style={{
                           display: "inline-flex",
                           alignItems: "center",
                           gap: "10px",
                           background: C.gold,
                           color: C.white,
                           fontSize: "15px",
                           fontWeight: 600,
                           letterSpacing: "0.01em",
                           padding: "16px 32px",
                           borderRadius: "2px",
                           textDecoration: "none",
                        }}
                     >
                        {t("about.missionCta")}
                        <i className="bi bi-arrow-right" style={{ fontSize: "13px" }} />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

// ── Values Block ─────────────────────────────────────────────────────────────
const ValuesBlock = () => {
   const { t } = useLanguage()
   const values = [
      {
         icon: "bi-eye",
         title: t("about.value1Title"),
         body: t("about.value1Body"),
      },
      {
         icon: "bi-award",
         title: t("about.value2Title"),
         body: t("about.value2Body"),
      },
      {
         icon: "bi-shield-check",
         title: t("about.value3Title"),
         body: t("about.value3Body"),
      },
   ]

   return (
      <div style={{ background: C.sage, padding: "120px 0" }}>
         <div className="container">
            {/* Header */}
            <div style={{ marginBottom: "72px" }}>
               <span
                  style={{
                     fontSize: "12px",
                     fontWeight: 700,
                     letterSpacing: "0.2em",
                     textTransform: "uppercase",
                     color: "rgba(24,45,64,0.45)",
                     marginBottom: "16px",
                     display: "block",
                  }}
               >
                  {t("about.valuesLabel")}
               </span>
               <h2
                  style={{
                     fontSize: "clamp(2.5rem, 6vw, 80px)",
                     fontWeight: 900,
                     lineHeight: 0.95,
                     letterSpacing: "-0.04em",
                     color: C.dark,
                     textTransform: "uppercase",
                     margin: 0,
                  }}
               >
                  {t("about.valuesTitle")}
               </h2>
            </div>

            {/* Cards */}
            <div className="row g-4">
               {values.map((v, i) => (
                  <div key={i} className="col-lg-4">
                     <div
                        style={{
                           background: C.white,
                           border: `1px solid rgba(24,45,64,0.08)`,
                           borderRadius: "2px",
                           padding: "48px 40px",
                           height: "100%",
                           transition: "border-color 0.25s ease, transform 0.25s ease",
                        }}
                        className="nubia-value-card"
                     >
                        {/* Icon */}
                        <div
                           style={{
                              width: "52px",
                              height: "52px",
                              background: C.goldAlpha,
                              border: `1px solid rgba(217,167,106,0.25)`,
                              borderRadius: "2px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "28px",
                           }}
                        >
                           <i
                              className={`bi ${v.icon}`}
                              style={{ fontSize: "20px", color: C.gold }}
                           />
                        </div>
                        {/* Number tag */}
                        <span
                           style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "rgba(24,45,64,0.3)",
                              display: "block",
                              marginBottom: "12px",
                           }}
                        >
                           0{i + 1}
                        </span>
                        <h4
                           style={{
                              fontSize: "22px",
                              fontWeight: 900,
                              letterSpacing: "-0.02em",
                              color: C.dark,
                              marginBottom: "16px",
                              textTransform: "uppercase",
                           }}
                        >
                           {v.title}
                        </h4>
                        <p
                           style={{
                              fontSize: "16px",
                              color: "rgba(24,45,64,0.55)",
                              lineHeight: 1.7,
                              margin: 0,
                           }}
                        >
                           {v.body}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <style>{`
            .nubia-value-card:hover {
               border-color: rgba(217,167,106,0.4) !important;
               transform: translateY(-4px);
            }
         `}</style>
      </div>
   )
}

// ── Story Block ──────────────────────────────────────────────────────────────
const StoryBlock = () => {
   const { t } = useLanguage()
   return (
      <div
         style={{
            background: C.dark3,
            padding: "120px 0",
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            position: "relative",
            overflow: "hidden",
         }}
      >
         {/* Big ghost text */}
         <span
            style={{
               position: "absolute",
               right: "-20px",
               bottom: "-20px",
               fontSize: "clamp(5rem, 16vw, 200px)",
               fontWeight: 900,
               lineHeight: 0.85,
               letterSpacing: "-0.06em",
               color: C.white,
               opacity: 0.04,
               textTransform: "uppercase",
               pointerEvents: "none",
               userSelect: "none",
            }}
         >
            NUBIA
         </span>

         <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div className="row align-items-center g-5">
               {/* Texto */}
               <div className="col-lg-6">
                  <span
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.gold,
                        marginBottom: "24px",
                     }}
                  >
                     <span style={{ width: "24px", height: "1px", background: C.gold, display: "inline-block" }} />
                     {t("about.storyLabel")}
                  </span>
                  <h2
                     style={{
                        fontSize: "clamp(2.2rem, 5vw, 64px)",
                        fontWeight: 900,
                        lineHeight: 0.92,
                        letterSpacing: "-0.04em",
                        color: C.white,
                        textTransform: "uppercase",
                        marginBottom: "28px",
                     }}
                  >
                     {t("about.storyTitle")}
                  </h2>
                  <p
                     style={{
                        fontSize: "17px",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.75,
                        maxWidth: "440px",
                        marginBottom: "32px",
                     }}
                  >
                     {t("about.storyBody")}
                  </p>
                  <span
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: C.goldAlpha,
                        border: `1px solid rgba(217,167,106,0.25)`,
                        padding: "8px 16px",
                        borderRadius: "100px",
                        color: C.gold2,
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                     }}
                  >
                     <span
                        style={{
                           width: "6px",
                           height: "6px",
                           background: C.gold,
                           borderRadius: "50%",
                           display: "inline-block",
                        }}
                     />
                     {t("about.storyNote")}
                  </span>
               </div>

               {/* Imagen */}
               <div className="col-lg-6">
                  <div className="row g-3">
                     <div className="col-6">
                        <div
                           style={{
                              borderRadius: "2px",
                              overflow: "hidden",
                              aspectRatio: "3/4",
                           }}
                        >
                           <img
                              src="/assets/images/media/img_55.jpg"
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                           />
                        </div>
                     </div>
                     <div className="col-6" style={{ paddingTop: "48px" }}>
                        <div
                           style={{
                              borderRadius: "2px",
                              overflow: "hidden",
                              aspectRatio: "3/4",
                           }}
                        >
                           <img
                              src="/assets/images/media/img_57.jpg"
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

// ── CTA Banner ───────────────────────────────────────────────────────────────
const CtaBanner = () => {
   const { t } = useLanguage()
   return (
      <div style={{ background: C.dark, padding: "0 0 120px" }}>
         <div className="container">
            <div
               style={{
                  background: C.dark2,
                  border: `1px solid ${C.border}`,
                  borderRadius: "2px",
                  padding: "clamp(48px, 8vw, 80px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "32px",
                  position: "relative",
                  overflow: "hidden",
               }}
            >
               {/* Gold accent line */}
               <div
                  style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     right: 0,
                     height: "3px",
                     background: `linear-gradient(90deg, ${C.gold}, ${C.gold2}, transparent)`,
                  }}
               />

               <div style={{ maxWidth: "560px" }}>
                  <span
                     style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.gold,
                        display: "block",
                        marginBottom: "16px",
                     }}
                  >
                     {t("about.ctaLabel")}
                  </span>
                  <h3
                     style={{
                        fontSize: "clamp(1.8rem, 4vw, 48px)",
                        fontWeight: 900,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        color: C.white,
                        textTransform: "uppercase",
                        marginBottom: "16px",
                     }}
                  >
                     {t("about.ctaTitle")}
                  </h3>
                  <p
                     style={{
                        fontSize: "16px",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.7,
                        margin: 0,
                     }}
                  >
                     {t("about.ctaBody")}
                  </p>
               </div>

               <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <Link
                     href="/listing_07"
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        background: C.gold,
                        color: C.white,
                        fontSize: "15px",
                        fontWeight: 600,
                        padding: "16px 32px",
                        borderRadius: "2px",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                     }}
                  >
                     {t("about.ctaBtn")}
                     <i className="bi bi-arrow-right" style={{ fontSize: "13px" }} />
                  </Link>
                  <Link
                     href="/contact"
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "transparent",
                        color: "rgba(255,255,255,0.65)",
                        fontSize: "15px",
                        fontWeight: 500,
                        padding: "16px 24px",
                        border: `1px solid rgba(255,255,255,0.12)`,
                        borderRadius: "2px",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                     }}
                  >
                     {t("about.ctaBtnSecondary")}
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
const AboutHero = () => {
   const { t } = useLanguage()
   return (
      <div
         style={{
            background: C.dark,
            paddingTop: "180px",
            paddingBottom: "100px",
            position: "relative",
            overflow: "hidden",
         }}
      >
         {/* Grid texture */}
         <div
            style={{
               position: "absolute",
               inset: 0,
               backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
               backgroundSize: "80px 80px",
               pointerEvents: "none",
            }}
         />

         <div className="container" style={{ position: "relative", zIndex: 1 }}>
            {/* Breadcrumb */}
            <div
               style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "48px",
               }}
            >
               <Link
                  href="/"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
               >
                  Inicio
               </Link>
               <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>/</span>
               <span style={{ fontSize: "13px", color: C.gold }}>
                  {t("nav.submenus.aboutUs")}
               </span>
            </div>

            <div className="row align-items-end g-5">
               <div className="col-lg-7">
                  {/* Badge */}
                  <div
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: C.goldAlpha,
                        border: `1px solid rgba(217,167,106,0.3)`,
                        padding: "8px 16px",
                        borderRadius: "100px",
                        color: C.gold2,
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        marginBottom: "32px",
                     }}
                  >
                     <span
                        style={{
                           width: "6px",
                           height: "6px",
                           background: C.gold,
                           borderRadius: "50%",
                           display: "inline-block",
                        }}
                     />
                     {t("about.heroLabel")}
                  </div>

                  <h1
                     style={{
                        fontSize: "clamp(3rem, 9vw, 110px)",
                        fontWeight: 900,
                        lineHeight: 0.88,
                        letterSpacing: "-0.04em",
                        color: C.white,
                        textTransform: "uppercase",
                        margin: 0,
                     }}
                  >
                     {t("about.heroTitle")}
                  </h1>
               </div>

               <div className="col-lg-5">
                  <div
                     style={{
                        paddingLeft: "clamp(0px, 4vw, 48px)",
                        borderLeft: `1px solid ${C.border}`,
                     }}
                  >
                     <p
                        style={{
                           fontSize: "17px",
                           color: "rgba(255,255,255,0.5)",
                           lineHeight: 1.75,
                           margin: 0,
                        }}
                     >
                        {t("about.heroBody")}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

// ── Main Export ──────────────────────────────────────────────────────────────
const AboutUsNubia = () => {
   return (
      <div className="nubia-home">
         <AboutHero />
         <StatsBar />
         <MissionBlock />
         <ValuesBlock />
         <StoryBlock />
         <CtaBanner />
      </div>
   )
}

export default AboutUsNubia
