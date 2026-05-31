import React, { useContext, useEffect, useRef, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { LuSearch, LuLogOut, LuLayoutDashboard } from 'react-icons/lu';
import { BLOG_NAVBAR_DATA } from '../../../utils/data';

import Logo from '../../../assets/react.svg'
import SideMenu from '../SideMenu';
import { UserContext } from '../../../context/userContext';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import CharAvatar from '../../Cards/CharAvatar';
import SearchBarPopup from '../../../pages/Blog/components/SearchBarPopup';

const BlogNavbar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [openProfileMenu, setOpenProfileMenu] = useState(false);

    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            clearUser();
            localStorage.clear();

            navigate("/", {
                replace: true,
            });
        }
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-3 px-2 sticky top-0 z-30">
                <div className="container mx-auto flex items-center justify-between gap-5">

                    {/* Left */}
                    <div className="flex gap-5">

                        {/* Menu movil */}
                        <button
                            className="block lg:hidden text-black"
                            onClick={() =>
                                setOpenSideMenu((prev) => !prev)
                            }
                        >
                            <HiOutlineMenu className="text-2xl" />
                        </button>

                        {/* Logo */}
                        <Link to="/">
                            <img
                                src={Logo}
                                alt="logo"
                                className="h-6 md:h-6.5"
                            />
                        </Link>
                    </div>

                    {/* Navegacion de Escritorio */}
                    <nav className="hidden md:flex items-center gap-10">
                        {BLOG_NAVBAR_DATA.map((item, index) => {
                            if (item?.onlySideMenu) return;

                            return (
                                <Link key={item.id} to={item.path}>
                                    <li className="text-[14px] text-black font-medium list-none relative group cursor-pointer">
                                        {item.label}
                                        <span
                                            className={`absolute inset-x-0 -bottom-1 h-0.5 bg-emerald-500 transition-all duration-300 origin-left 
                                                ${index === 0
                                                    ? "scale-x-100"
                                                    : "scale-x-0"
                                                }
                                            group-hover:scale-x-100`}
                                        />
                                    </li>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-6 relative">

                        {/* Buscar */}
                        <button
                            className="hover:text-emerald-500 cursor-pointer"
                            onClick={() =>
                                setOpenSearchBar((prev) => !prev)
                            }
                        >
                            <LuSearch className="text-[22px]" />
                        </button>

                        {/* Auth */}
                        {!user ? (
                            <button
                                className="flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-emerald-400 text-xs md:text-xs font-semibold text-white
                                px-4 md:px-4 py-1 rounded-lg hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-emerald-200"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        ) : (
                            <div
                                ref={dropdownRef}
                                className="relative flex items-center"
                            >
                                <button
                                    onClick={() => setOpenProfileMenu((prev) => !prev)}
                                >
                                    {user?.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <CharAvatar
                                            fullName={user?.name || ""}
                                            width="w-10"
                                            height="h-10"
                                            style="text-sm"
                                        />
                                    )}
                                </button>

                                <div
                                    className={`absolute top-12 right-1 w-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50 transition-all duration-200 origin-top-right ${openProfileMenu ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 -translate-y-2 scale-95 invisible"}`}
                                >

                                    {/* Usuario */}
                                    <div className="pb-3 border-b border-gray-100">
                                        <h4 className="font-semibold text-gray-900">
                                            {user?.name}
                                        </h4>

                                        <p className="text-sm text-gray-500">
                                            {user?.email}
                                        </p>
                                    </div>

                                    {/* Opciones */}
                                    <div className="mt-3 space-y-1">
                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                                            onClick={() => {
                                                navigate("/dashboard");
                                                setOpenProfileMenu(false);
                                            }}
                                        >
                                            <LuLayoutDashboard className="text-xl" />
                                            Dashboard
                                        </button>

                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50"
                                            onClick={handleLogout}
                                        >
                                            <LuLogOut className="text-xl" />
                                            Logout
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile side menu */}
            {openSideMenu && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpenSideMenu(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${openSideMenu ? "translate-x-0" : "-translate-x-full"}`}
            >
                <SideMenu
                    isBlogMenu
                    closeMenu={() => setOpenSideMenu(false)}
                />
            </div>
            
            <SearchBarPopup isOpen={openSearchBar} setIsOpen={setOpenSearchBar} />
        </>
    );
};

export default BlogNavbar;