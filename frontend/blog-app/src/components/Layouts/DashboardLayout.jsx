import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="bg-white min-h-screen">
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">
                    <div className="hidden lg:block">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className="flex-1 px-5 py-5">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;