import {
    LuLayoutDashboard,
    LuGalleryVerticalEnd,
    LuMessageSquareQuote,
    LuLayoutTemplate,
    LuTag,
    LuUser,
    LuShield,
    LuTrash2,
    LuBookmark,
    LuHeart,
    LuMessageCircleDashed,
    LuMailCheck,
    LuMail,
} from 'react-icons/lu';

import { RxUpdate } from 'react-icons/rx';
import { FaHome, FaMailBulk, FaRegSave } from 'react-icons/fa';
import { FaGears, FaUserGear } from 'react-icons/fa6';
import { BiSolidColorFill } from "react-icons/bi";

export const ADMIN_SIDE_MENU = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard"
    },
    {
        id: "02",
        label: "Blog Posts",
        icon: LuGalleryVerticalEnd,
        path: "/posts"
    },
    {
        id: "03",
        label: "Comments",
        icon: LuMessageSquareQuote,
        path: "/comments"
    },
    {
        id: "04",
        label: "User List",
        icon: LuUser,
        path: "/users"
    },
    {
        id: "05",
        label: "Blog",
        icon: FaHome,
        path: "/"
    },
    {
        id: "06",
        label: "Settings",
        icon: FaGears,
        path: "/settings"
    },
    {
        id: "07",
        label: "FeedBack",
        icon: FaMailBulk,
        path: "/feedback"
    },
];

export const MEMBER_SIDE_MENU = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard"
    },
    {
        id: "02",
        label: "Blog",
        icon: FaHome,
        path: "/"
    },
    {
        id: "03",
        label: "Settings",
        icon: FaGears,
        path: "/settings"
    },
    {
        id: "04",
        label: "FeedBack",
        icon: FaMailBulk,
        path: "/feedback"
    },
    {
        id: "05",
        label: "Saved Data",
        icon: FaRegSave,
        path: "/saved"
    },
];

export const BLOG_NAVBAR_DATA = [
    {
        id: "01",
        label: "Home",
        icon: LuLayoutTemplate,
        path: "/"
    },
    {
        id: "02",
        label: "React Js",
        icon: LuTag,
        path: "/tag/React"
    },
    {
        id: "03",
        label: "Next Js",
        icon: LuTag,
        path: "/tag/Next"
    },
    {
        id: "04",
        label: "Angular",
        icon: LuTag,
        path: "/tag/Angular"
    },
    {
        id: "05",
        label: "PHP",
        icon: LuTag,
        path: "/tag/PHP"
    },
    {
        id: "06",
        label: "Laravel",
        icon: LuTag,
        path: "/tag/Laravel"
    },
    {
        id: "07",
        label: "Java",
        icon: LuTag,
        path: "/tag/Java"
    },
];

// New added by Me
export const SETTINGS_SIDE_MENU = [
    {
        id: "01",
        label: "Profile Update",
        icon: LuUser,
    },
    {
        id: "02",
        label: "Username Update",
        icon: RxUpdate,
    },
    {
        id: "03",
        label: "Security",
        icon: LuShield,
    },
    {
        id: "04",
        label: "Appearance",
        icon: BiSolidColorFill,
    },
    {
        id: "05",
        label: "Delete Account",
        icon: LuTrash2,
    },
];

export const SUPERADMIN_SIDE_MENU = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard"
    },
        {
        id: "02",
        label: "Blog Posts",
        icon: LuGalleryVerticalEnd,
        path: "/posts"
    },
    {
        id: "03",
        label: "Comments",
        icon: LuMessageSquareQuote,
        path: "/comments"
    },
    {
        id: "04",
        label: "User List",
        icon: LuUser,
        path: "/users"
    },
    {
        id: "05",
        label: "Blog",
        icon: FaHome,
        path: "/"
    },
    {
        id: "06",
        label: "Settings",
        icon: FaGears,
        path: "/settings"
    },
];