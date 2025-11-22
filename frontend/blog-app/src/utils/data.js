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
        path: "/admin/dashboard"
    },
    {
        id: "02",
        label: "Blog Posts",
        icon: LuGalleryVerticalEnd,
        path: "/admin/posts"
    },
    {
        id: "03",
        label: "Comments",
        icon: LuMessageSquareQuote,
        path: "/admin/comments"
    },
    {
        id: "04",
        label: "User List",
        icon: LuUser,
        path: "/admin/users"
    },
    {
        id: "06",
        label: "User Profile",
        icon: FaUserGear,
        path: "/admin/profile"
    },
    {
        id: "06",
        label: "Blog",
        icon: FaHome,
        path: "/"
    },
    {
        id: "07",
        label: "Settings",
        icon: FaGears,
        path: "/admin/settings"
    },
    {
        id: "08",
        label: "FeedBack",
        icon: FaMailBulk,
        children: [
            {
                id: "08-1",
                label: "Received FeedBack",
                icon: LuMail,
                path: "/admin/feedback"
            },
        ],
    },
];

export const MEMBER_SIDE_MENU = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/blog/dashboard"
    },
    {
        id: "02",
        label: "User Profile",
        icon: FaUserGear,
        path: "/blog/dashboard"
    },
    {
        id: "03",
        label: "Blog",
        icon: FaHome,
        path: "/"
    },
    {
        id: "04",
        label: "Settings",
        icon: FaGears,
        path: "/blog/settings"
    },
    {
        id: "05",
        label: "FeedBack",
        icon: FaMailBulk,
        children: [
            {
                id: "05-1",
                label: "Send FeedBack",
                icon: LuMail,
                path: "/blog/feedback"
            },
            {
                id: "05-2",
                label: "Feedback responses",
                icon: LuMailCheck,
                path: "/blog/feedback-response"
            },
        ],
    },
    {
        id: "06",
        label: "Saved Data",
        icon: FaRegSave,
        children: [
            {
                id: "06-1",
                label: "Saved Posts",
                icon: LuBookmark,
                path: "/blog/posts"
            },
            {
                id: "06-2",
                label: "My Likes",
                icon: LuHeart,
                path: "/blog/likes"
            },
        ],
    },
];

export const BLOG_USER_EXTRA_MENU = [ //Test
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/blog/dashboard"
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