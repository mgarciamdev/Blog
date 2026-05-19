import React from 'react'

const RoleProgressCard = ({ role, value, total, color }) => {
    const percentage = total
        ? Math.max((value / total) * 100, 0)
        : 0;

    return (
        <div className="space-y-2">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-gray-800 mt-1.5">
                        {role}
                    </h4>

                    <p className="text-xs text-gray-400 mt-2">
                        {value} users
                    </p>
                </div>

                <span className="text-sm font-medium text-gray-600">
                    {Math.round(percentage)}%
                </span>
            </div>

            {/* Progress Background */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                {/* Progress Fill */}
                <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                        width: `${percentage}%`,
                        minWidth: percentage > 0 ? "12px" : "0px",
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
};

export default RoleProgressCard;