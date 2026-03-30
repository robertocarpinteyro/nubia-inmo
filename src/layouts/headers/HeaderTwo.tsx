"use client"
import NavMenu from "./Menu/NavMenu"
import Link from "next/link"
import { useState } from "react"
import UseSticky from "@/hooks/UseSticky"
import LoginModal from "@/modals/LoginModal"
import Offcanvas from "./Menu/Offcanvas"
import HeaderSearchbar from "./Menu/HeaderSearchbar"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import Image from "next/image"

import logo_1 from "@/assets/images/logo/logo_02.svg"
import logo_2 from "@/assets/images/logo/logo_04.svg"
import logo_3 from "@/assets/images/logo/logo_06.svg"

// Logo NUBIA con fallback a texto si el archivo no existe aún
const NubiaLogo = () => {
   const [err, setErr] = useState(false)
   if (err) return <span className="nubia-logo-text">NUBIA</span>
   return (
      <img
         src="/assets/images/logo/Nubia_Logotipo.png"
         alt="NUBIA"
         height={56}
         style={{ height: 56, width: "auto" }}
         onError={() => setErr(true)}
      />
   )
}

const HeaderTwo = ({ style_1, style_2, nubia }: any) => {
   const { sticky } = UseSticky()
   const [offCanvas, setOffCanvas] = useState<boolean>(false)
   const [isSearch, setIsSearch] = useState<boolean>(false)
   const { user, isAuthenticated, logout } = useAuth()
   const { lang, toggleLang, t } = useLanguage()

   const canPublish = user?.role === "admin" || user?.role === "vendedor"
   const firstName = user?.name?.split(" ")[0] || ""
   const initials = user?.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "U"

   return (
      <>
         <div className={`theme-main-menu menu-overlay sticky-menu ${style_2 ? "menu-style-four" : style_1 ? "menu-style-three" : "menu-style-two"} ${sticky ? "fixed" : ""}`}>
            <div className={`inner-content ${style_2 ? "gap-two" : "gap-one"}`}>
               <div className="top-header position-relative">
                  <div className="d-flex align-items-center">

                     {/* ── LOGO ── */}
                     <div className="logo order-lg-0">
                        <Link href="/" className="d-flex align-items-center">
                           {nubia ? (
                              <NubiaLogo />
                           ) : (
                              <Image src={style_2 ? logo_3 : style_1 ? logo_2 : logo_1} alt="NUBIA" />
                           )}
                        </Link>
                     </div>

                     {/* ── RIGHT WIDGET ── */}
                     <div className="right-widget ms-auto me-3 me-lg-0 order-lg-3">
                        <ul className="d-flex align-items-center style-none gap-2">

                           {/* Switcher idioma */}
                           <li>
                              <button
                                 onClick={toggleLang}
                                 title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
                                 style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.4)",
                                    borderRadius: 3,
                                    padding: "3px 8px",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    letterSpacing: "0.08em",
                                    color: "rgba(255,255,255,0.6)",
                                    transition: "all 0.2s",
                                 }}
                                 onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                 onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
                              >
                                 {lang === "es" ? "EN" : "ES"}
                              </button>
                           </li>

                           {!style_2 ? (
                              <>
                                 {isAuthenticated ? (
                                    /* ── Auth: logged in ── */
                                    <li className="d-flex align-items-center" style={{ gap: 8 }}>
                                       {/* Avatar + nombre → dashboard */}
                                       <Link
                                          href="/dashboard/dashboard-index"
                                          target="_blank"
                                          className="d-flex align-items-center tran3s"
                                          style={{ gap: 8, textDecoration: "none", color: "inherit" }}
                                       >
                                          <span style={{
                                             width: 32, height: 32,
                                             borderRadius: "50%",
                                             background: "#7B4FFF",
                                             color: "#fff",
                                             fontSize: 12,
                                             fontWeight: 700,
                                             display: "flex",
                                             alignItems: "center",
                                             justifyContent: "center",
                                             flexShrink: 0,
                                             letterSpacing: "0.05em",
                                          }}>
                                             {initials}
                                          </span>
                                          <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
                                             {firstName}
                                          </span>
                                       </Link>
                                       {/* Logout */}
                                       <button
                                          onClick={logout}
                                          title={t("header.logout")}
                                          style={{
                                             background: "transparent",
                                             border: "none",
                                             cursor: "pointer",
                                             padding: "4px 6px",
                                             opacity: 0.5,
                                             transition: "opacity 0.2s",
                                             display: "flex",
                                             alignItems: "center",
                                          }}
                                          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                          onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
                                       >
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                             <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                                          </svg>
                                       </button>
                                    </li>
                                 ) : (
                                    /* ── Auth: not logged in ── */
                                    <li className="d-flex align-items-center login-btn-one">
                                       <i className="fa-regular fa-lock"></i>
                                       <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal" className="fw-500 tran3s">
                                          {t("header.login")} <span className="d-none d-sm-inline-block">/ {lang === "es" ? "Registrarse" : "Sign up"}</span>
                                       </Link>
                                    </li>
                                 )}

                                 {/* CTA button */}
                                 <li className="d-none d-md-inline-block ms-2 ms-xl-3 me-xl-3">
                                    {canPublish ? (
                                       <Link href="/dashboard/add-property" className={style_1 ? "btn-ten" : "btn-two rounded-0"} target="_blank">
                                          <span>{t("header.publishProperty")}</span> <i className="fa-thin fa-arrow-up-right"></i>
                                       </Link>
                                    ) : (
                                       <Link href="/contact" className={style_1 ? "btn-ten" : "btn-two rounded-0"}>
                                          <span>{t("header.scheduleVisit")}</span> <i className="fa-thin fa-arrow-up-right"></i>
                                       </Link>
                                    )}
                                 </li>

                                 {/* Hamburger */}
                                 <li className="d-none d-xl-block">
                                    <button
                                       onClick={() => setOffCanvas(true)}
                                       className="sidenavbtn rounded-circle tran3s"
                                       type="button"
                                       style={{ cursor: "pointer" }}
                                    >
                                       <i className="fa-sharp fa-light fa-bars-filter"></i>
                                    </button>
                                 </li>
                              </>
                           ) : (
                              <>
                                 <li className="d-none d-md-flex align-items-center login-btn-one me-4 me-xxl-5">
                                    <i className="fa-regular fa-phone-volume"></i>
                                    <Link href="tel:+528112345678" className="tran3s">+52 (81) 1234-5678</Link>
                                 </li>
                                 {isAuthenticated ? (
                                    <li className="d-flex align-items-center" style={{ gap: 6 }}>
                                       <Link
                                          href="/dashboard/dashboard-index"
                                          target="_blank"
                                          className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center"
                                          title="Dashboard"
                                          style={{
                                             background: "#7B4FFF",
                                             color: "#fff",
                                             border: "none",
                                             fontSize: 11,
                                             fontWeight: 700,
                                             letterSpacing: "0.05em",
                                          }}
                                       >
                                          {initials}
                                       </Link>
                                       <button
                                          onClick={logout}
                                          className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center"
                                          title={t("header.logout")}
                                          style={{ border: "none", cursor: "pointer" }}
                                       >
                                          <i className="fa-regular fa-arrow-right-from-bracket"></i>
                                       </button>
                                    </li>
                                 ) : (
                                    <li>
                                       <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal" className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center">
                                          <i className="fa-regular fa-lock"></i>
                                       </Link>
                                    </li>
                                 )}
                                 <li>
                                    <a onClick={() => setIsSearch(true)} style={{ cursor: "pointer" }} className="search-btn-one rounded-circle tran3s d-flex align-items-center justify-content-center">
                                       <i className="bi bi-search"></i>
                                    </a>
                                 </li>
                              </>
                           )}
                        </ul>
                     </div>

                     {/* ── NAV ── */}
                     <nav className="navbar navbar-expand-lg p0 ms-lg-5 order-lg-2">
                        <button className="navbar-toggler d-block d-lg-none" type="button" data-bs-toggle="collapse"
                           data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                           aria-label="Toggle navigation">
                           <span></span>
                        </button>
                        <div className={`collapse navbar-collapse ${style_2 ? "ms-xl-5" : ""}`} id="navbarNav">
                           <NavMenu />
                        </div>
                     </nav>
                  </div>
               </div>
            </div>
         </div>

         <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
         <LoginModal />
         <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch} />
      </>
   )
}

export default HeaderTwo
