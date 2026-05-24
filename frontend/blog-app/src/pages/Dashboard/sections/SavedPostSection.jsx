import React from 'react'
import SavedPostCard from '../components/SavedPostCard';
import { LuBookmark } from 'react-icons/lu';
import EmptyState from '../../../components/EmptyState';
import ListSkeleton from '../../../components/Loaders/dashboard/ListSkeleton';

const SavedPostSection = ({ saved, loading }) => {

    const recentSaved = saved.slice(0, 4);

    if (loading) {
        return <ListSkeleton items={4} showImage/>;
    }

    return (
        <div className="space-y-4">
            {!recentSaved?.length ? (
                <EmptyState
                    icon={<LuBookmark />}
                    title="No existen post guardados todavia"
                    description="Los ultimos posts que guardes apareceran aqui."
                />
            ) : (
                recentSaved.map((item) => (
                    <SavedPostCard
                        key={item._id}
                        post={item.post}
                        savedAt={item.savedAt}
                    />
                ))
            )}
        </div>
    );
};

export default SavedPostSection;