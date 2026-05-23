import React from 'react'

const EmptyState = ({ icon, title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-3xl mb-3 text-emerald-500">
                {icon}
            </div>

            <h3 className="text-sm font-semibold text-gray-800">
                {title}
            </h3>

            <p className="text-xs text-gray-500 mt-1 max-w-55">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;