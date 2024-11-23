import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Post from '../components/post';
import SEO from '../components/seo';

import 'prismjs/themes/prism-okaidia.css';

export default function BlogPost({ data }) {
  const { post } = data;
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        slug={post.fields.slug}
        keywords={post.frontmatter.tags}
      />
      <Post {...post} showLink={false} />
    </Layout>
  );
}

export const blogPostQuery = graphql`
  query BlogPostDetails($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...PostDetails
    }
  }
`;
