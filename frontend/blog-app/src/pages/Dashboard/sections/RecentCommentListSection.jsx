import React from 'react'
import CharAvatar from '../../../components/Cards/CharAvatar'
import { LuDot, LuMessageSquareDashed } from 'react-icons/lu'
import moment from 'moment'
import { roleAvatarStyles, roleStyles } from '../../../utils/helper'
import EmptyState from '../../../components/EmptyState'
import ListSkeleton from '../../../components/Loaders/dashboard/ListSkeleton'

const RecentCommentListSection = ({ comments, loading }) => {
    if (loading) {
        return <ListSkeleton items={3} showImage/>;
    }

    return (
        <div className="animate-fadeIn mt-4">
            <div className="space-y-4">
                {!comments?.length ? (
                    <EmptyState
                        icon={<LuMessageSquareDashed />}
                        title="No existen comentarios todavia"
                        description="Aquí aparecerán los comentarios recientes."
                    />
                ) : (
                    comments?.slice(0, 3)?.map((comment) => (
                        <li
                            key={comment._id}
                            className="flex gap-4 border-b border-gray-100 pb-4 last:border-none hover:bg-gray-50 hover:scale-[1.01] transition-all duration-300 rounded-xl p-2 cursor-pointer"
                        >
                            {comment.author?.profileImageUrl ? (
                                <img
                                    src={comment.author?.profileImageUrl}
                                    alt={comment.author?.name}
                                    className={`w-11 h-11 ring-2 rounded-full object-cover
                                    ${roleAvatarStyles[comment.author?.role || "member"]}`}
                                />
                            ) : (
                                <CharAvatar
                                    fullName={comment.author?.name || ""}
                                    width="w-11"
                                    height="h-11"
                                    style={`text-lg ring-2 rounded-full object-cover
                                    ${roleAvatarStyles[comment.author?.role || "member"]}`}
                                />
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-[13px] text-gray-500">
                                                @{comment.author?.name}
                                            </p>

                                            <LuDot className="text-gray-500" />

                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleStyles[comment.author?.role || "member"]?.className}`}
                                            >
                                                {roleStyles[comment.author?.role || "member"]?.label}
                                            </span>

                                            <LuDot className="text-gray-500" />

                                            <span className="text-[12px] text-gray-500 font-medium">
                                                {moment(comment.updatedAt).fromNow()}
                                            </span>

                                            <LuDot className="text-gray-500" />

                                            <span className="text-[12px] text-gray-500 font-medium">
                                                {moment(comment.updatedAt).format("MMM D")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-black mt-0.5 line-clamp-2">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                                    <img
                                        src={comment.post?.coverImageUrl}
                                        alt={comment.post?.title}
                                        className="w-9 h-9 rounded-md object-cover"
                                    />
                                    <p className="text-[13px] text-gray-700 line-clamp-2 hover:text-emerald-600 transition-colors">
                                        {comment.post?.title}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </div>
        </div>
    )
}

export default RecentCommentListSection