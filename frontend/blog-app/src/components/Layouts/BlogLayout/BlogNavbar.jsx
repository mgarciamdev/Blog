import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { BLOG_NAVBAR_DATA } from '../../../utils/data';


import Logo from '../../../assets/react.svg'

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

                    </nav>
                </div>
            </div>
        </>
    )
}

export default BlogNavbar