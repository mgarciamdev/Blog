import React from 'react'

const ChartSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="h-5 w-40 bg-gray-200 rounded-md mb-6"></div>

            <div className="flex items-end justify-between gap-3 h-55">
                <div className="w-10 bg-gray-200 rounded-t-xl h-24"></div>
                <div className="w-10 bg-gray-200 rounded-t-xl h-40"></div>
                <div className="w-10 bg-gray-200 rounded-t-xl h-32"></div>
                <div className="w-10 bg-gray-200 rounded-t-xl h-52"></div>
                <div className="w-10 bg-gray-200 rounded-t-xl h-28"></div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            
        </div>
    );
};

export default ChartSkeleton;