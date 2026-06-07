import React from 'react'
import { LuEye, LuHeart, LuHeartCrack, LuTrash2 } from 'react-icons/lu';

const BlogPostSummaryCard = ({
    title,
    imgUrl,
    updatedOn,
    tags,
    likes,
    dislikes,
    views,
    onClick,
    onDelete
}) => {
    return (
        <div
            className="relative flex items-start gap-4 bg-gray-100/50 pb-3 mb-5 rounded-lg cursor-pointer group"
            onClick={onClick}
        >
            <img src={imgUrl} alt={title} className="w-16 h-16 rounded-lg" />

            <div className="flex-1">
                <h3 className="text-[13px] md:text-[15px] text-black font-medium">
                    {title}
                </h3>

                <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                    <div className="text-[11px] text-gray-700 font-medium bg-gray-100 px-2.5 py-1 rounded">
                        Updated: {updatedOn}
                    </div>

                    <div className="h-6 w-px bg-gray-300/70" />

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded">
                            <LuEye className="text-[16px] text-emerald-500" /> {views}
                        </span>

                        <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded">
                            <LuHeart className="text-[16px] text-emerald-500" />
                            {likes}
                        </span>

                        <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded">
                            <LuHeartCrack className="text-[16px] text-emerald-500" />
                            {dislikes}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-gray-300/70" />

                    <div className="flex flex-wrap items-center gap-2.5">
                        {tags.map((tag, index) => (
                            <div
                                key={`tag_${index}`}
                                className="text-xs text-emerald-700 font-medium bg-emerald-100/50 px-2.5 py-1 rounded"
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                className="absolute top-4 right-1 md:top-2 flex items-center text-xs text-rose-500 font-medium px-2 py-1 rounded border border-rose-100 bg-white hover:bg-rose-400 hover:text-white cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                <LuTrash2 className="mr-1" /> <span className="hidden md:block">Eliminar</span>
            </button>

        </div>
    );
};

export default BlogPostSummaryCard;