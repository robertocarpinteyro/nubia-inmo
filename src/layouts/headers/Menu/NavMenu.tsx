"use client";
import menu_data from "@/data/home-data/MenuData";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import logo from "@/assets/images/logo/logo_01.svg";

// Logo NUBIA mobile con fallback
const MobileLogo = () => {
   const [err, setErr] = useState(false)
   if (err) return <Image src={logo} alt="NUBIA" />
   return <img src="/assets/images/logo/Nubia_Logotipo.png" alt="NUBIA" height={24} style={{ height: 24, width: "auto" }} onError={() => setErr(true)} />
}

const NavMenu = () => {
    const pathname = usePathname();
    const [navTitle, setNavTitle] = useState("");
    const { user } = useAuth();
    const { t } = useLanguage();

    const openMobileMenu = (menu: any) => {
        setNavTitle((prev) => (prev === menu ? "" : menu));
    };

    // Dashboard sólo para admin y vendedor
    const canSeeDashboard = user?.role === "admin" || user?.role === "vendedor";

    return (
        <ul className="navbar-nav align-items-lg-center">
            <li className="d-block d-lg-none">
                <div className="logo">
                    <Link href="/" className="d-block">
                        <MobileLogo />
                    </Link>
                </div>
            </li>

            {canSeeDashboard && (
                <li className="nav-item dashboard-menu">
                    <Link className="nav-link" href="/dashboard/dashboard-index" target="_blank">
                        {t("nav.dashboard")}
                    </Link>
                </li>
            )}

            {menu_data.map((menu: any) => (
                <li
                    key={menu.id}
                    className={`nav-item dropdown ${menu.class_name || ""} ${menu.key === "home" ? "no-dropdown" : ""}`}
                >
                    <Link
                        href={menu.link}
                        className={`nav-link ${menu.has_dropdown && menu.key !== "home" ? "dropdown-toggle" : ""}
                        ${pathname === menu.link ? "active" : ""} ${navTitle === menu.key ? "show" : ""}`}
                        onClick={() => menu.key !== "home" && openMobileMenu(menu.key)}
                    >
                        {t(`nav.${menu.key}`)}
                    </Link>
                    {menu.has_dropdown && menu.key !== "home" && (
                        <ul className={`dropdown-menu ${navTitle === menu.key ? "show" : ""}`}>
                            {menu.sub_menus &&
                                menu.sub_menus.map((sub_m: any, i: any) => (
                                    <li key={i}>
                                        <Link
                                            href={sub_m.link}
                                            className={`dropdown-item ${pathname === sub_m.link ? "active" : ""}`}
                                        >
                                            <span>{t(`nav.submenus.${sub_m.key}`)}</span>
                                        </Link>
                                    </li>
                                ))}
                            {menu.menu_column && (
                                <li className="row gx-1">
                                    {menu.menu_column.map((item: any) => (
                                        <div key={item.id} className="col-lg-4">
                                            <div className="menu-column">
                                                <h6 className="mega-menu-title">{item.mega_title}</h6>
                                                <ul className="style-none mega-dropdown-list">
                                                    {item.mega_menus.map((mega_m: any, i: any) => (
                                                        <li key={i}>
                                                            <Link
                                                                href={mega_m.link}
                                                                className={`dropdown-item ${pathname === mega_m.link ? "active" : ""}`}
                                                            >
                                                                <span>{t(`nav.submenus.${mega_m.key}`)}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            )}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default NavMenu;
