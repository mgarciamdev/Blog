import React, { useEffect, useState } from 'react';
import {
    BLOG_NAVBAR_DATA,
    ADMIN_SIDE_MENU,
    BLOG_USER_EXTRA_MENU,
    MEMBER_SIDE_MENU
} from "../../utils/data";
import { LuLogOut } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { useMemo } from 'react';
import CharAvatar from '../Cards/CharAvatar';

const SideMenu = ({ activeMenu, isBlogMenu }) => {
    const location = useLocation();
    const user = null
    const [openMenu, setOpenMenu] = useState(() => []);
    const navigate = useNavigate();

    const handleClick = (route) => {
        //Redirección especial para el dashboard segun el rol que inicio sesion
        if (route.toLowerCase().includes("dashboard")) {
            route = true?.role === "admin" ? "/admin/dashboard" : "/blog/dashboard";
        }

        if (route === "logout") {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();

        navigate("/", { replace: true });
    }

    // Combinamos los menús segun el contexto
    const finalMenu = useMemo(() => {
        if (isBlogMenu) {
            let menu = [...BLOG_NAVBAR_DATA];
            if (user) {
                menu = [...menu, ...BLOG_USER_EXTRA_MENU];
            }
            return menu;
        } else {
            return user?.role === "admin" ? ADMIN_SIDE_MENU : MEMBER_SIDE_MENU;
        }
    }, [isBlogMenu, user]);

    const toggleMenu = (id) => {
        setOpenMenu((prev) => {
            if (!Array.isArray(prev)) return [id]; // Realiza un fallback de seguridad
            return prev.includes(id)
                ? prev.filter((menuId) => menuId !== id)
                : [...prev, id];
        });
    };

    useEffect(() => {
        const match = finalMenu.find(item =>
            item.children?.some(sub => sub.path === location.pathname)
        );

        const next = match ? [match.id] : [];

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenMenu(prev =>
            JSON.stringify(prev) === JSON.stringify(next) ? prev : next
        );
    }, [location.pathname, finalMenu]);


    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 fixed top-[49px] z-20">
            {user && (
                <div className="flex flex-col items-center justify-center gap-1 mt-3 mb-7">
                    {user?.profileImageUrl ? (
                        <img
                            src={user?.profileImageUrl}
                            alt="Profile Image"
                            className="w-20 h-20 bg-slate-400 rounded-full"
                        />
                    ) : (
                        <CharAvatar 
                            fullName={user?.name || ""}
                            width="w-20"
                            height="h-20"
                            style="text-xl"
                        />
                    )}
                    <div>
                        <h5 className="text-gray-950 font-semibold text-center leading-6 mt-1">
                            {user?.name || ""}
                        </h5>
                        <p className="text-[13px] font-medium text-gray-800 text-center">
                            {user?.email || ""}
                        </p>
                    </div>
                </div>
            )}

            {/* Menú Dinámico */}
            {finalMenu.map((item, index) => (
                <div key={`menu_${index}`} className="w-full">
                    <button
                        className={`w-full flex items-center gap-4 text-[15px] ${activeMenu === item.label
                            ? "text-white bg-linear-to-r from-emerald-500 to-green-300"
                            : ""
                            } py-3 px-6 rounded-lg mb-3 cursor-pointer`}
                        onClick={() => {
                            if (item.children) {
                                // Menú Toggle
                                toggleMenu(item.id);
                            } else {
                                handleClick(item.path);
                            }
                        }}
                    >
                        <item.icon className='text-xl' />
                        {item.label}

                        {item.children && (
                            openMenu.includes(item.id) ? (
                                <LuChevronDown className="text-lg transition-transform duration-200" />
                            ) : (
                                <LuChevronUp className="text-lg transition-transform duration-200" />
                            )
                        )}
                    </button>
                    {/* Render de submenu si existen hijos */}
                    {item.children && openMenu.includes(item.id) && (
                        <div className="ml-8 mt-2 space-y-2">
                            {item.children.map((subItem) => (
                                <button
                                    key={subItem.id}
                                    className={`w-full flex items-center gap-1.5 text-[14px] px-4 py-2 rounded-lg ${location.pathname === subItem.path ? "text-emerald-500" : ""}`}
                                    onClick={() => handleClick(subItem.path)}
                                >
                                    <subItem.icon className="text-lg" />
                                    {subItem.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Logout */}
            {user && (
                <button 
                    className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer`}
                    onClick={() => handleLogout()}
                >
                    <LuLogOut className="text-xl" />
                    Logout
                </button>
            )}
        </div>
    );
};

export default SideMenu;