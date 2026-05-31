import React, { useContext } from 'react';
import {
    BLOG_NAVBAR_DATA,
    ADMIN_SIDE_MENU,
    MEMBER_SIDE_MENU,
    SUPERADMIN_SIDE_MENU
} from "../../utils/data";
import { LuChevronRight, LuLogOut } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { useMemo } from 'react';
import CharAvatar from '../Cards/CharAvatar';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import LOGO from "../../assets/Guatemala.svg";

const SideMenu = ({ closeMenu, isBlogMenu }) => {
    const location = useLocation();
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (route) => {

        if (route === "logout") {
            handleLogout();
            return;
        }

        navigate(route);

        if (closeMenu) {
            closeMenu();
        }
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Error al cerrar sesión: ", error)
        } finally {
            clearUser();

            localStorage.clear();

            if (closeMenu) {
                closeMenu();
            }

            navigate("/", {
                replace: true
            });
        }
    }

    // Combinamos los menús segun el contexto
    const finalMenu = useMemo(() => {
        if (isBlogMenu) {
            return BLOG_NAVBAR_DATA;
        }

        switch (user?.role) {
            case "superadmin":
                return SUPERADMIN_SIDE_MENU;

            case "admin":
                return ADMIN_SIDE_MENU

            default:
                return MEMBER_SIDE_MENU;
        }

    }, [isBlogMenu, user]);

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 p-5 overflow-y-auto">
            <div className="flex justify-center mt-5 mb-8">
                <img
                    src={LOGO}
                    alt="prueba"
                    className="h-12 object-contain"
                />
            </div>

            {/* Menú Dinámico */}
            {finalMenu.map((item, index) => {
                const isActive = location.pathname === item.path || item.children?.some(
                    (sub) => sub.path === location.pathname
                );
                return (
                    <div key={`menu_${index}`} className="w-full">
                        <button
                            className={`w-full flex items-center gap-4 text-[15px] ${isActive
                                ? "text-white bg-linear-to-r from-emerald-500 to-green-300"
                                : "text-gray-700 hover:bg-gray-100"
                                } py-3 px-6 rounded-lg mb-3 cursor-pointer`}
                            onClick={() => handleClick(item.path)}
                        >
                            <item.icon className='text-xl' />
                            {item.label}

                        </button>
                    </div>
                )
            })}
        </div>
    );
};

export default SideMenu;