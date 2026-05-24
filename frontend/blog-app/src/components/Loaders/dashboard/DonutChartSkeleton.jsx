import React from 'react'

const DonutChartSkeleton = () => {
    return (
        <div className="animate-pulse flex flex-col items-center">
            <div className="">

                <div className="w-44 h-44 rounded-full border-18 border-gray-200 mt-7"></div>

                <div className="flex gap-6 mt-8">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonutChartSkeleton;