import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'

export default function BlogPost({ data }) {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: data.post.html }} />
    </Layout>
  )
}

export const blogPostQuery = graphql`
  query BlogPostDetails($slug: String!) {
    post:markdownRemark(fields: { slug: { eq: $slug }}) {
      html
    }
  }
`