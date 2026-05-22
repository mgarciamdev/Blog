import React from 'react'
import SavedPostCard from '../components/SavedPostCard';

const SavedPostSection = ({ saved }) => {

    const recentSaved = saved.slice(0, 4);

    return (
        <div className="space-y-4">
            {recentSaved.map((item) => (
                <SavedPostCard
                    key={item._id}
                    post={item.post}
                    savedAt={item.savedAt}
                />
            ))}
        </div>
    );
};

export default SavedPostSection;