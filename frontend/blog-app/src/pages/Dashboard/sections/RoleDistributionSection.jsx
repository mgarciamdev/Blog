import React from 'react'
import RoleProgressCard from '../components/RoleProgressCard';

const RoleDistributionSection = ({ stats }) => {

    const roleData = [
        {
            role: "Super Admins",
            value: stats?.superadmin || 0,
            color: "#047857",
        },
        {
            role: "Admins",
            value: stats?.admins || 0,
            color: "#10b981",
        },
        {
            role: "Members",
            value: stats?.members || 0,
            color: "#0ea5e9",
        },
    ];
    
    return (
        <div className="grid grid-cols-5 mt-4">
            <div className="col-span-12 md:col-span-7">
                {roleData.map((item) => (
                    <RoleProgressCard
                        key={item.role}
                        role={item.role}
                        value={item.value}
                        total={stats?.totalUsers}
                        color={item.color}
                    />
                ))}
                
            </div>
        </div>
    );
};

export default RoleDistributionSection;