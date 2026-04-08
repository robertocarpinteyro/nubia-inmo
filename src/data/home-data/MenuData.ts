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
];

export default menu_data;
