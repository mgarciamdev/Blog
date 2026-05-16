import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

import LOGO from "../../assets/react.svg";
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex items-center justify-between gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-40">
            <button
                className="block lg:hidden text-black"
                onClick={() => {
                    setOpenSideMenu((prev) => !prev);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>

            <img
                src={LOGO}
                alt="logo"
                className="h-6 md:h-6.5"
            />

            {openSideMenu && (
                <div className="fixed top-18 left-0 bg-white z-50">
                    <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
                </div>
            )}
        </div>
    );
};

export default Navbar;