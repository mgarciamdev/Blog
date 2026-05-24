import React from 'react'
import RoleDistributionSection from './RoleDistributionSection';
import VerificationSection from './verificationSection';
import TagInsights from '../components/TagInsights';

const SuperAdminInsightsSection = ({ tagUsage, stats, loading }) => {
    const hasVerification =
        stats?.verifiedUsers > 0 ||
        stats?.unVerifiedUsers > 0;

    const hasRoles =
        stats?.superadmin > 0 ||
        stats?.admins > 0 ||
        stats?.members > 0 ||
        stats?.totalUsers > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">

            <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Tag Insights
                    </h3>
                </div>

                <TagInsights tagUsage={tagUsage} loading={loading} />
            </div>

            {(loading || hasVerification) && (
                <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            User Verification Status
                        </h3>
                    </div>

                    <VerificationSection stats={stats} loading={loading} />
                </div>
            )}

            {(loading || hasRoles) && (
                <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Rol Distribution
                        </h3>
                    </div>

                    <RoleDistributionSection stats={stats} loading={loading} />
                </div>
            )}
        </div>
    );
};

export default SuperAdminInsightsSection;