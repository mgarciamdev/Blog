import moment from 'moment';
import React from 'react'
import { LuBookmark } from 'react-icons/lu';

const SavedPostCard = ({ post, savedAt }) => {
    return (
        <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-300 cursor-pointer">
            {/* Imagen */}
            {post?.coverImageUrl ? (
                <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover"
                />
            ) : (
                <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <LuBookmark className="text-emerald-700 text-xl" />
                </div>
            )}

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {post?.title}
                </h4>
                <p className="text-xs text-gray-400 mt-2">
                    Saved {moment(savedAt).fromNow()}
                </p>
            </div>
        </div>
    );
};

export default SavedPostCard;