import React, { useContext, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { BLOG_NAVBAR_DATA } from '../../../utils/data';


import Logo from '../../../assets/react.svg'
import { FaCircleChevronDown, FaCircleChevronUp } from 'react-icons/fa6';

const BlogNavbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [openProfileMenu, setOpenProfileMenu] = useState(false) /* nuevo Const */

    return (
        <>
            <div className="bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-3 px-2 top-0 z-30">
                <div className="container mx-auto flex items-center justify-between gap-5">
                    <div className="flex gap-5">
                        <button
                            className="block lg:hidden text-black -mt-1"
                            onClick={() => {
                                setOpenSideMenu(!openSideMenu);
                            }}
                        >
                            {openSideMenu ? (
                                <HiOutlineX className="text-2xl" />
                            ) : (
                                <HiOutlineMenu className="text-2xl" />
                            )}
                        </button>

                        <Link>
                            <img src={Logo} alt="logo" className="h-[24px] md:h-[26px]" />
                        </Link>

                    </div>

                    <nav className="hidden md:flex items-center gap-10">
                        {BLOG_NAVBAR_DATA.map((item, index) => {
                            if (item?.onlySideMenu) return;

                            return (
                                <Link key={item.id} to={item.path}>
                                    <li className="text-[14px] text-black font-medium list-none relative group cursor-pointer">
                                        {item.label}
                                        <span
                                            className={`absolute inset-x-0 bottom-0 h-[2px] bg-emerald-500 transition-all duration-300 origin-left ${index == 0 ? "scale-x-100" : "scale-x-0"}
                                            group-hover:scale-x-100`}
                                        ></span>
                                    </li>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-6 relative">
                        <button
                            className="hover:text-emerald-500 cursor-pointer"
                            onClick={() => setOpenSearchBar(true)}
                        >
                            <LuSearch className="text-[22px]" />
                        </button>

                        {true ? (
                            <button
                                className="flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-emerald-400 text-xs md:text-xs font-semibold text-white
                                px-4 md:px-4 py-1 rounded-lg hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-emerald-200"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="hidden md:flex items-center gap-2 cursor-pointer relative">
                                {/* <ProfileInfoCard /> */}
                                <span
                                    onClick={() => setOpenProfileMenu(!openProfileMenu)}
                                >
                                    {openProfileMenu ? (
                                        <FaCircleChevronUp size={18} />
                                    ) : (
                                        <FaCircleChevronDown size={18} />
                                    )}
                                </span>

                                {openProfileMenu && (
                                    <div className="absolute top-13.5 right-0 bg-white shadow-md rounded-md py-1 w-40 z-50">
                                        <button
                                            className="w-full text-left px-10 py-2 hover:bg-gray-100 hover:text-emerald-400 rounded"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            className="w-full text-left px-10 py-2 hover:bg-gray-100 hover:text-red-400 rounded"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {openSideMenu && (
                        <div className="fixed top-[61px] -ml-4 bg-white">

                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogNavbar;