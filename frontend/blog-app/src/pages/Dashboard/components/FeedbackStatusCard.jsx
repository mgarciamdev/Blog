import React from 'react'

const FeedbackStatusCard = ({ title, value, icon, bgColor, iconColor }) => {
    return (
        <div className="p-5 rounded-2xl border border-gray-100 bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}>
                <div className={`text-xl ${iconColor}`}>
                    {icon}
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-500 font-medium">
                    {title}
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {value}
                </h3>
            </div>
        </div>
    );
};

export default FeedbackStatusCard;