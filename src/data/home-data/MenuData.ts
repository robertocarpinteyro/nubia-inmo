interface SubMenu {
    link: string;
    title: string;
    key: string;
}

interface MenuColumn {
    id: number;
    mega_title: string;
    mega_menus: { link: string; title: string; key: string }[];
}

interface MenuItem {
    id: number;
    key: string;
    title: string;
    class_name?: string;
    link: string;
    has_dropdown: boolean;
    sub_menus?: SubMenu[];
    menu_column?: MenuColumn[];
}

const menu_data: MenuItem[] = [
    {
        id: 1,
        key: "home",
        has_dropdown: false,
        title: "Inicio",
        link: "/",
        sub_menus: [],
    },
    {
        id: 2,
        key: "listing",
        has_dropdown: false,
        title: "Propiedades",
        link: "/listing_07",
        sub_menus: [],
    },
    {
        id: 3,
        key: "pages",
        has_dropdown: true,
        title: "Páginas",
        link: "#",
        sub_menus: [
            { link: "/about_us_02", title: "Nosotros", key: "aboutUs" },
            { link: "/contact", title: "Contacto", key: "contactUs" },
            { link: "/faq", title: "Preguntas Frecuentes", key: "faq" },
        ],
    },
    {
        id: 4,
        key: "blog",
        has_dropdown: true,
        title: "Blog",
        link: "#",
        sub_menus: [
            { link: "/blog_01", title: "Blog Grid", key: "blogGrid" },
            { link: "/blog_02", title: "Blog Lista", key: "blogList" },
            { link: "/blog_03", title: "Blog 2 Columnas", key: "blog2col" },
            { link: "/blog_details", title: "Entrada de Blog", key: "blogDetails" },
        ],
    },
];

export default menu_data;
