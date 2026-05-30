import React from 'react'
import BlogNavbar from './BlogNavbar'

const BlogLayout = ({ children }) => {
    return (
        <div className='bg-white pb-32'>
            <BlogNavbar />

            <div className="container mx-auto px-5 md:px-0 mt-10">{children}</div>
        </div>
    )
}

export default BlogLayout