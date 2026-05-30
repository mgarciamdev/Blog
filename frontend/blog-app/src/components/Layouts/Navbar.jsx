import React, { useContext, useEffect, useRef, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

import LOGO from "../../assets/Guatemala.svg";
import SideMenu from './SideMenu';
import { UserContext } from '../../context/userContext';
import CharAvatar from '../Cards/CharAvatar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuLogOut, LuUser } from 'react-icons/lu';

const Navbar = ({ onMenuClick }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Error al cerrar sesión: ", error)
        } finally {
            clearUser();

            localStorage.clear();

            navigate("/", {
                replace: true
            });
        }
    }

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white border-b border-gray-100/50 px-5 py-5">
            <div className="flex items-center">
                <button
                    className="block lg:hidden text-black"
                    onClick={onMenuClick}
                >
                    <HiOutlineMenu className="text-2xl" />
                </button>


            </div>
            <div ref={dropdownRef} className="flex items-center gap-4">

                <img
                    src={LOGO}
                    alt="logo"
                    className="h-5"
                />

                {/* Avatar */}
                <button
                    onClick={() => setOpenDropdown((prev) => !prev)}
                    className="relative"
                >
                    {user?.profileImageUrl ? (
                        <img
                            src={user?.profileImageUrl}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover hover:bg-linear-to-r from-gray-400 to-gray-200"
                        />
                    ) : (
                        <CharAvatar
                            fullName={user?.name || ""}
                            width="w-9"
                            height="h-9"
                            style="text-sm hover:bg-linear-to-r from-gray-400 to-gray-200"
                        />
                    )}
                </button>

                {/* Dropdown */}

                <div className={`absolute top-15 right-6 w-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50 transition-all duration-200 origin-top-right ${openDropdown ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 -translate-y-2 scale-95 invisible"}`}>
                    {/* User Infor */}
                    <div className="pb-3 border-b border-gray-100">
                        <h4 className="font-semibold text-gray-900">
                            {user?.name}
                        </h4>

                        <p className="text-sm text-gray-500">
                            {user?.email}
                        </p>
                    </div>

                    {/* MENU */}
                    <div className="mt-3 space-y-1">
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                            onClick={() => navigate("/profile")}
                        >
                            <LuUser className="text-xl" />
                            Mi Perfil
                        </button>
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50"
                            onClick={() => handleLogout()}
                        >
                            <LuLogOut className="text-xl" />
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Navbar;