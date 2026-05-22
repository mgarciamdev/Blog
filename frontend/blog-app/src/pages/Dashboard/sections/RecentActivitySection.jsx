import moment from 'moment';
import React from 'react'
import { LuBadgeCheck, LuBookmark, LuMessageSquareMore } from 'react-icons/lu';

const RecentActivitySection = ({ saved, feedbacks }) => {
    const savedActivities = saved.map((item) => ({
        id: item._id,
        type: "save",
        title: item.post?.title,
        slug: item.post?.slug,
        image: item.post?.coverImageUrl,
        date: item.savedAt,
    }));

    const feedbackActivities = feedbacks.map((item) => ({
        id: item._id,
        type: "feedback",
        title: item.title,
        message: item.message,
        status: item.status,
        response: item.response?.content,
        date: item.response?.respondedAt || item.createdAt,
    }));

    const activities = [
        ...savedActivities,
        ...feedbackActivities,
    ];

    activities.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const limitedActivities = activities.slice(0, 3);

    return (
        <div className="space-y-4">
            {limitedActivities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-300"
                >
                    {/* ICONO */}
                    <div className="mt-1">
                        {activity.type === "save" && (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <LuBookmark className="text-emerald-700 text-lg" />
                            </div>
                        )}

                        {activity.type === "feedback" && activity.status !== "responded" && (
                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                                <LuMessageSquareMore className="text-sky-700 text-lg" />
                            </div>
                        )}

                        {activity.type === "feedback" && activity.status === "responded" && (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <LuBadgeCheck className="text-emerald-700 text-lg" />
                            </div>
                        )}
                    </div>
                    {/* CONTENIDO */}
                    <div className="flex-1">
                        {/* TITULO */}
                        {activity.type === "save" && (
                            <>
                                <p className="text-sm font-semibold text-gray-900">
                                    Saved a post
                                </p>

                                <p className="text-sm text-gray-600 mt-1">
                                    {activity.title}
                                </p>
                            </>
                        )}

                        {activity.type === "feedback" && activity.status !== "responded" && (
                            <>
                                <p className="text-sm font-semibold text-gray-900">
                                    sent feedback
                                </p>

                                <p className="text-sm text-gray-600 mt-1">
                                    {activity.title}
                                </p>
                            </>
                        )}

                        {activity.type === "feedback" && activity.status === "responded" && (
                            <>
                                <p className="text-sm font-semibold text-gray-900">
                                    Support responded
                                </p>

                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {activity.response}
                                </p>
                            </>
                        )}

                        {/* FECHA */}
                        <p className="text-xs text-gray-400 mt-2">
                            {moment(activity.date).fromNow()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RecentActivitySection