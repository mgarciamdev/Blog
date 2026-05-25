import React from 'react'
import BlogLayout from '../../components/Layouts/BlogLayout/BlogLayout'
import PageTransition from '../../components/Transitions/PageTransition'

const BlogLandingPage = () => {
  return (
    <PageTransition>
      <BlogLayout>
        BlogLandingPage
      </BlogLayout>
    </PageTransition>
  )
}

export default BlogLandingPage