import React from 'react'

const ListSkeleton = ({ items = 3, showImage = true }) => {

    return (
        <div className="animate-pulse space-y-5">
            {Array.from({ length: items }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-start gap-4"
                >
                    {showImage && (
                        <div className="w-20 h-20 rounded-xl bg-gray-200" />
                    )}

                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-3 mt-14"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2 mt-14"></div>
                    {/* <div className="h-3 bg-gray-200 rounded w-4/5 mt-8"></div> */}
                </div>
            ))}
        </div>
    );
};

export default ListSkeleton;