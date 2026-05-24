import React from 'react'
import TopPostCard from '../components/TopPostCard';
import { LuMessageSquareOff } from 'react-icons/lu';
import ListSkeleton from '../../../components/Loaders/dashboard/ListSkeleton';

const TopPostSection = ({ posts = [], loading }) => {
    const maxViews = Math.max(...posts.map((post) => post.views || 0), 1);

    if (loading) {
        return <ListSkeleton items={3} showImage/>;
    }

    return (
        <div className="col-span-12 md:col-span-5 mt-5 md:mt-0">

            <div className="space-y-4">
                {!posts?.length ? (
                    <EmptyState
                        icon={<LuMessageSquareOff />}
                        title="No hay top posts todavia"
                        description="Aqui apareceran los posts mas valorados."
                    />
                ) : (
                    posts.slice(0, 3).map((post) => (
                        <TopPostCard
                            key={post._id}
                            title={post.title}
                            coverImageUrl={post.coverImageUrl}
                            views={post.views}
                            likes={post.likes}
                            maxViews={maxViews}
                        />
                    ))
                )}
            </div>

        </div>
    )
}

export default TopPostSection