import React from 'react'
import RoleProgressCard from '../components/RoleProgressCard';
import EmptyState from '../../../components/EmptyState';
import { LuUser } from 'react-icons/lu';
import ChartSkeleton from '../../../components/Loaders/dashboard/ChartSkeleton';

const RoleDistributionSection = ({ stats, loading }) => {

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

    const hasRoleData = roleData.some(
        (item) => item.value > 0
    );

    if (loading) {
        return <ChartSkeleton />;
    }

    if (!hasRoleData) {
    return (
        <div className="min-h-80 flex items-center justify-center">
            <EmptyState
                icon={<LuUser />}
                title="No hay datos de roles de usuarios"
                description="Aquí aparecerán las estadísticas de roles de usuario."
            />
        </div>
    );
}
    
    return (
        <div className="animate-fadeIn mt-4">

                {roleData.map((item) => (
                    <RoleProgressCard
                        key={item.role}
                        role={item.role}
                        value={item.value}
                        total={stats?.totalUsers || 0}
                        color={item.color}
                    />
                ))}

        </div>
    );
};

export default RoleDistributionSection;