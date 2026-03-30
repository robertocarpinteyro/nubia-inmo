"use client"
import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

const ContactArea = () => {
   const { t } = useLanguage()
   const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
   const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setStatus("sending")
      // Placeholder — conectar a endpoint cuando esté disponible
      await new Promise(r => setTimeout(r, 1200))
      setStatus("success")
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setStatus("idle"), 5000)
   }

   const infoCards = [
      {
         icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
               <polyline points="22,6 12,13 2,6" />
            </svg>
         ),
         label: t("contact.infoEmail"),
         value: t("contact.infoEmailValue"),
         href: `mailto:${t("contact.infoEmailValue")}`,
      },
      {
         icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
         ),
         label: t("contact.infoPhone"),
         value: t("contact.infoPhoneValue"),
         href: `tel:${t("contact.infoPhoneValue").replace(/\s/g, "")}`,
      },
      {
         icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
         ),
         label: t("contact.infoHours"),
         value: t("contact.infoHoursValue"),
         href: null,
      },
      {
         icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
         ),
         label: t("contact.infoAddress"),
         value: t("contact.infoAddressValue"),
         href: null,
      },
   ]

   const inputStyle: React.CSSProperties = {
      width: "100%",
      background: "#111111",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 2,
      padding: "14px 16px",
      color: "#F5F5F2",
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s",
   }

   return (
      <div style={{ background: "#0C0C0C", minHeight: "100vh" }}>

         {/* ── HERO ── */}
         <div style={{ paddingTop: 120, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="container">
               <div style={{ padding: "48px 0 40px" }}>
                  {/* Breadcrumb */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                     <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link>
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                     <span style={{ color: "rgba(255,255,255,0.6)" }}>{t("contact.breadcrumb")}</span>
                  </div>
                  <h1 style={{
                     fontFamily: "Gordita, sans-serif",
                     fontWeight: 900,
                     fontSize: "clamp(2.5rem, 6vw, 72px)",
                     color: "#F5F5F2",
                     letterSpacing: "-0.04em",
                     lineHeight: 0.95,
                     margin: 0,
                  }}>
                     {t("contact.heroTitle")}
                  </h1>
                  <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 16, marginBottom: 0, maxWidth: 480 }}>
                     {t("contact.heroSubtitle")}
                  </p>
               </div>
            </div>
         </div>

         {/* ── INFO CARDS ── */}
         <div className="container" style={{ padding: "56px 0 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
               {infoCards.map((card, i) => (
                  <div key={i} style={{
                     background: "#111111",
                     padding: "28px 24px",
                     borderRight: i < infoCards.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                     <div style={{
                        width: 40, height: 40, borderRadius: 2,
                        background: "rgba(123,79,255,0.1)",
                        border: "1px solid rgba(123,79,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#9D7AFF", marginBottom: 16,
                     }}>
                        {card.icon}
                     </div>
                     <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                        {card.label}
                     </div>
                     {card.href ? (
                        <a href={card.href} style={{ fontSize: 14, color: "#F5F5F2", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                           onMouseEnter={e => (e.currentTarget.style.color = "#9D7AFF")}
                           onMouseLeave={e => (e.currentTarget.style.color = "#F5F5F2")}>
                           {card.value}
                        </a>
                     ) : (
                        <span style={{ fontSize: 14, color: "#F5F5F2", fontWeight: 500 }}>{card.value}</span>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* ── FORM + MAP ── */}
         <div className="container" style={{ padding: "56px 0 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>

               {/* Form */}
               <div style={{ background: "#111111", padding: "40px 36px" }}>
                  <h2 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: 24, color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: 32 }}>
                     {t("contact.formTitle")}
                  </h2>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                     {/* Name + Email */}
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                           <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                              {t("contact.formName")}
                           </label>
                           <input
                              name="name" type="text" required
                              placeholder={t("contact.formNamePlaceholder")}
                              value={form.name} onChange={handleChange}
                              style={inputStyle}
                              onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                           />
                        </div>
                        <div>
                           <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                              {t("contact.formEmail")}
                           </label>
                           <input
                              name="email" type="email" required
                              placeholder={t("contact.formEmailPlaceholder")}
                              value={form.email} onChange={handleChange}
                              style={inputStyle}
                              onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                           />
                        </div>
                     </div>

                     {/* Phone + Subject */}
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                           <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                              {t("contact.formPhone")}
                           </label>
                           <input
                              name="phone" type="tel"
                              placeholder={t("contact.formPhonePlaceholder")}
                              value={form.phone} onChange={handleChange}
                              style={inputStyle}
                              onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                           />
                        </div>
                        <div>
                           <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                              {t("contact.formSubject")}
                           </label>
                           <input
                              name="subject" type="text"
                              placeholder={t("contact.formSubjectPlaceholder")}
                              value={form.subject} onChange={handleChange}
                              style={inputStyle}
                              onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                           />
                        </div>
                     </div>

                     {/* Message */}
                     <div>
                        <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                           {t("contact.formMessage")}
                        </label>
                        <textarea
                           name="message" required rows={5}
                           placeholder={t("contact.formMessagePlaceholder")}
                           value={form.message} onChange={handleChange}
                           style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                           onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                           onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                        />
                     </div>

                     {/* Submit */}
                     <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
                        <button
                           type="submit"
                           disabled={status === "sending"}
                           style={{
                              background: status === "sending" ? "rgba(123,79,255,0.5)" : "#7B4FFF",
                              color: "#fff",
                              border: "none",
                              borderRadius: 2,
                              padding: "14px 32px",
                              fontSize: 13,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              cursor: status === "sending" ? "not-allowed" : "pointer",
                              transition: "background 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                           }}
                           onMouseEnter={e => { if (status !== "sending") e.currentTarget.style.background = "#6B3FEF" }}
                           onMouseLeave={e => { if (status !== "sending") e.currentTarget.style.background = "#7B4FFF" }}
                        >
                           {status === "sending" ? (
                              <>{t("contact.formSending")}</>
                           ) : (
                              <>{t("contact.formSend")} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></>
                           )}
                        </button>

                        {status === "success" && (
                           <span style={{ fontSize: 13, color: "#4ADE80", display: "flex", alignItems: "center", gap: 6 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                              {t("contact.formSuccess")}
                           </span>
                        )}
                        {status === "error" && (
                           <span style={{ fontSize: 13, color: "#F87171" }}>{t("contact.formError")}</span>
                        )}
                     </div>
                  </form>
               </div>

               {/* Map */}
               <div style={{ background: "#0C0C0C", position: "relative", minHeight: 500, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                     <iframe
                        title={t("contact.mapTitle")}
                        src="https://maps.google.com/maps?q=San+Pedro+Garza+Garcia,+Nuevo+Leon,+Mexico&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        style={{ width: "100%", height: "100%", border: "none", filter: "invert(90%) hue-rotate(180deg) brightness(0.85)" }}
                        loading="lazy"
                     />
                  </div>
                  {/* Overlay label */}
                  <div style={{
                     position: "absolute", bottom: 24, left: 24,
                     background: "rgba(12,12,12,0.85)",
                     backdropFilter: "blur(8px)",
                     border: "1px solid rgba(255,255,255,0.08)",
                     borderRadius: 2,
                     padding: "10px 16px",
                     display: "flex", alignItems: "center", gap: 8,
                  }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9D7AFF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                     <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                        {t("contact.infoAddressValue")}
                     </span>
                  </div>
               </div>

            </div>
         </div>

      </div>
   )
}

export default ContactArea
