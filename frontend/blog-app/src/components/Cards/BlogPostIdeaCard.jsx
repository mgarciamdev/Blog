import React from 'react'

const BlogPostIdeaCard = ({ title, description, tags, tone, onSelect }) => {
    return (
        <div
            className="border-b border-gray-100 hover:bg-gray-100/60 hover:shadow-sm rounded px-4 md:px-6 py-4 md:py-5 cursor-pointer transition-all"
            onClick={onSelect}
        >
            <h3 className="text-sm text-black font-medium line-clamp-2">
                {title}{" "}
                <span className="inline-flex items-center text-xs font-medium text-yellow-900 bg-yellow-100 px-2 py-1 rounded-full">
                    {tone}
                </span>
            </h3>

            <p className="text-xs font-medium text-gray-600/70 mt-1 line-clamp-2">{description}</p>

            <div className="flex flex-wrap items-center gap-2.5 mt-2">
                {tags.map((tag, index) => (
                    <div
                        key={`tag_${index}`}
                        className="text-xs text-emerald-800 font-medium bg-green-100 px-2.5 py-1 rounded"
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPostIdeaCard;