import React, { useContext, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { BLOG_NAVBAR_DATA } from '../../../utils/data';


import Logo from '../../../assets/react.svg'
import { FaCircleChevronDown, FaCircleChevronUp } from 'react-icons/fa6';
import SideMenu from '../SideMenu';
import { UserContext } from '../../../context/userContext';
import { isAdminRole } from '../../../utils/helper';

const BlogNavbar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [openProfileMenu, setOpenProfileMenu] = useState(false) /* nuevo Const */

    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        setOpenProfileMenu(false)
    };

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
                            {openSideMenu ? (
                                <HiOutlineX className="text-2xl" />
                            ) : (
                                <HiOutlineMenu className="text-2xl" />
                            )}
                        </button>

                        {/* Logo */}
                        <Link to="/">
                            <img
                                src={Logo}
                                alt="logo"
                                className="h-6 md:h-[26px]"
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
                            <div className="hidden md:flex items-center gap-2 cursor-pointer relative">
                                {/* <ProfileInfoCard /> */}
                                <span
                                    onClick={() =>
                                        setOpenProfileMenu((prev) => !prev)
                                    }
                                >
                                    {openProfileMenu ? (
                                        <FaCircleChevronUp size={18} />
                                    ) : (
                                        <FaCircleChevronDown size={18} />
                                    )}
                                </span>

                                {/* Dropdown */}
                                {openProfileMenu && (
                                    <div className="absolute top-14 right-0 bg-white shadow-lg border border-gray-100 rounded-md py-1 w-44 z-50">
                                        <Link
                                            to={
                                                isAdminRole(user?.role)
                                                    ? "/admin/dashboard"
                                                    : "/dashboard"
                                            }
                                        >
                                            <button
                                                className="w-full text-left px-10 py-2 hover:bg-gray-100 hover:text-emerald-400 rounded"
                                            >
                                                Dashboard
                                            </button>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-10 py-2 hover:bg-gray-100 hover:text-red-400 rounded"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile side menu */}
                    {openSideMenu && (
                        <div className="fixed top-15.25 left-0 bg-white z-50">
                            <SideMenu
                                isBlogMenu
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogNavbar;