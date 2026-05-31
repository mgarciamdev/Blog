import React from 'react'
import BlogNavbar from './BlogNavbar'

const BlogLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white">
            <BlogNavbar />

            <main className="container mx-auto px-5 pt-24">
                {children}
            </main>
        </div>
    );
};

export default BlogLayout;