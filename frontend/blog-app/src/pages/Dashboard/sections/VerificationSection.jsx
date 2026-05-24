import React from 'react'
import VerificationChart from '../components/VerificationChart';
import EmptyState from '../../../components/EmptyState';
import { LuShieldCheck } from 'react-icons/lu';
import DonutChartSkeleton from '../../../components/Loaders/dashboard/DonutChartSkeleton';

const VerificationSection = ({ stats, loading }) => {

    if (loading) {
        return <DonutChartSkeleton />;
    }

    const totalUsers = stats?.totalUsers || 0;

    const charData = [
        {
            name: "Verified",
            value: stats?.verifiedUsers || 0,
        },
        {
            name: "Unverified",
            value: stats?.unVerifiedUsers || 0,
        },
    ];

    if (totalUsers === 0) {
        return (
            <div className="min-h-80 flex items-center justify-center">
                <EmptyState
                    icon={<LuShieldCheck />}
                    title="No hay datos de verificación"
                    description="Aquí aparecerán las estadísticas de verificación de usuarios."
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-5 mt-4">
            <div className="col-span-12 md:col-span-7">
                <VerificationChart data={charData} totalUsers={totalUsers} />
            </div>
        </div>
    );
};

export default VerificationSection;