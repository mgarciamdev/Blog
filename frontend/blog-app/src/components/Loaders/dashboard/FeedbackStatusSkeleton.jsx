import React from 'react'

const FeedbackStatusSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
                
            </div>

            <div className="mt-6 bg-gray-100 rounded-2xl p-4">
                <div className="h-3 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 w-full bg-gray-200 rounded mb-3"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

export default FeedbackStatusSkeleton;