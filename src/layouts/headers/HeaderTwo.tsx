"use client"
import NavMenu from "./Menu/NavMenu"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import UseSticky from "@/hooks/UseSticky"
import LoginModal from "@/modals/LoginModal"
import Offcanvas from "./Menu/Offcanvas"
import HeaderSearchbar from "./Menu/HeaderSearchbar"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

import logo_1 from "@/assets/images/logo/logo_02.svg";
import logo_2 from "@/assets/images/logo/logo_04.svg";
import logo_3 from "@/assets/images/logo/logo_06.svg";

const HeaderTwo = ({ style_1, style_2, nubia }: any) => {
   const { sticky } = UseSticky();
   const [offCanvas, setOffCanvas] = useState<boolean>(false);
   const [isSearch, setIsSearch] = useState<boolean>(false);
   const { user, isAuthenticated, logout } = useAuth();
   const { lang, toggleLang, t } = useLanguage();

   // Dashboard accesible sólo para admin y vendedor
   const canPublish = user?.role === "admin" || user?.role === "vendedor";

   return (
      <>
         <div className={`theme-main-menu menu-overlay sticky-menu ${style_2 ? "menu-style-four" : style_1 ? "menu-style-three" : "menu-style-two"} ${sticky ? "fixed" : ""}`}>
            <div className={`inner-content ${style_2 ? "gap-two" : "gap-one"}`}>
               <div className="top-header position-relative">
                  <div className="d-flex align-items-center">
                     <div className="logo order-lg-0">
                        <Link href="/" className="d-flex align-items-center">
                           {nubia ? (
                              <span className="nubia-logo-text">NUBIA</span>
                           ) : (
                              <Image src={style_2 ? logo_3 : style_1 ? logo_2 : logo_1} alt="" />
                           )}
                        </Link>
                     </div>

                     <div className="right-widget ms-auto me-3 me-lg-0 order-lg-3">
                        <ul className="d-flex align-items-center style-none">
                           {/* Switcher de idioma — siempre visible */}
                           <li className="me-2 me-xl-3">
                              <button
                                 onClick={toggleLang}
                                 title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
                                 style={{
                                    background: "transparent",
                                    border: "1px solid currentColor",
                                    borderRadius: 4,
                                    padding: "2px 8px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    letterSpacing: "0.05em",
                                    opacity: 0.75,
                                    transition: "opacity 0.2s",
                                 }}
                                 onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                 onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
                              >
                                 {lang === "es" ? "EN" : "ES"}
                              </button>
                           </li>

                           {!style_2 ? (
                              <>
                                 {/* Botón login / nombre de usuario */}
                                 {isAuthenticated ? (
                                    <li className="d-flex align-items-center login-btn-one">
                                       <i className="fa-regular fa-user me-1"></i>
                                       <span className="fw-500" style={{ fontSize: 14 }}>
                                          {t("header.greeting")}, {user?.name?.split(" ")[0]}
                                       </span>
                                       <button
                                          onClick={logout}
                                          style={{
                                             background: "transparent",
                                             border: "none",
                                             cursor: "pointer",
                                             marginLeft: 10,
                                             fontSize: 13,
                                             opacity: 0.65,
                                          }}
                                       >
                                          ({t("header.logout")})
                                       </button>
                                    </li>
                                 ) : (
                                    <li className="d-flex align-items-center login-btn-one">
                                       <i className="fa-regular fa-lock"></i>
                                       <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal" className="fw-500 tran3s">
                                          {t("header.login")} <span className="d-none d-sm-inline-block">/ {lang === "es" ? "Registrarse" : "Sign up"}</span>
                                       </Link>
                                    </li>
                                 )}

                                 {/* Botón CTA: Publicar para admin/vendedor, Agendar para el resto */}
                                 <li className="d-none d-md-inline-block ms-3 ms-xl-4 me-xl-4">
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

                                 <li className="d-none d-xl-block">
                                    <button onClick={() => setOffCanvas(true)} style={{ cursor: "pointer" }} className="sidenavbtn rounded-circle tran3s" type="button">
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
                                    <li>
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
