'use client'
import "../styles/index.scss";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="es" suppressHydrationWarning={isDev}>
      <head>
        <title>NUBIA Inmobiliaria — Propiedades en México</title>
        <meta name="description" content="Conectamos personas con el hogar de sus sueños en México. Propiedades residenciales, comerciales e inversión con NUBIA Inmobiliaria." />
        <meta name="keywords" content="inmobiliaria México, casas en venta, departamentos, terrenos, propiedades en renta, inversión inmobiliaria" />
        <meta name="author" content="NUBIA Inmobiliaria" />
        {/* Open Graph */}
        <meta property="og:site_name" content="NUBIA Inmobiliaria" />
        <meta property="og:url" content="https://nubiainmo.mx" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NUBIA Inmobiliaria — Propiedades en México" />
        <meta property="og:description" content="Conectamos personas con el hogar de sus sueños en México. Propiedades residenciales, comerciales e inversión." />
        <meta property="og:image" content="/assets/images/logo/Nubia_Logotipo.png" />
        {/* Twitter/X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NUBIA Inmobiliaria — Propiedades en México" />
        <meta name="twitter:description" content="Conectamos personas con el hogar de sus sueños en México." />
        <meta name="twitter:image" content="/assets/images/logo/Nubia_Logotipo.png" />
        {/* Viewport & compat */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Theme color — NUBIA navy */}
        <meta name="theme-color" content="#182D40" />
        <meta name="msapplication-navbutton-color" content="#182D40" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#182D40" />
        {/* Favicon — isotipo NUBIA */}
        <link rel="icon" href="/assets/images/logo/Nubia_isotipo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/images/logo/Nubia_isotipo.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,1,300;9..144,1,400&family=JetBrains+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap" />
      </head>
      <body suppressHydrationWarning={true}>
        <div className="main-page-wrapper">
          <Provider store={store}>
            <AuthProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </AuthProvider>
          </Provider>
        </div>
      </body>
    </html>
  )
}
