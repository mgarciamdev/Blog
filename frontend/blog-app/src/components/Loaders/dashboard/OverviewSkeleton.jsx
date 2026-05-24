import React from 'react'

const OverviewSkeleton = ({ cards = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 animate-pulse mt-4">

            {Array(cards)
                .fill(0)
                .map((_, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3"
                    >

                        <div className="w-10 h-10 rounded-lg bg-gray-200"></div>

                        <div className="flex-1">
                            <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                            <div className="h-5 w-10 bg-gray-200 rounded"></div>
                        </div>

                    </div>
                ))}
        </div>
    );
}
    ;
export default OverviewSkeleton;