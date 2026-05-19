import React from 'react'
import VerificationChart from '../components/VerificationChart';

const VerificationSection = ({ stats }) => {

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

    return (
        <div className="grid grid-cols-5 mt-4">
            <div className="col-span-12 md:col-span-7">
                <VerificationChart data={charData} totalUsers={stats?.totalUsers || 0} />
            </div>
        </div>
    )
}

export default VerificationSection