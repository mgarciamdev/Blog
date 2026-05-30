import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children }) => {
    const { user } = useContext(UserContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-white min-h-screen">
            <Navbar
                onMenuClick={() => setSidebarOpen(true)}
            />

            {user && (
                <>
                    {/* Overlay mobile */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* SIDEBAR */}
                    <div
                        className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                    >
                        <SideMenu
                            closeMenu={() => setSidebarOpen(false)}
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="lg:ml-64 pt-17.5 px-5 py-5">
                        {children}
                    </div>

                </>
            )}
        </div>
    );
};

export default DashboardLayout;