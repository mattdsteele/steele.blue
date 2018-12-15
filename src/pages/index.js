import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import Post from '../components/post';
import SEO from '../components/seo';
import About from '../components/about';

export default function IndexPage({ data }) {
  const [latest] = data.posts.edges;
  return (
    <Layout>
      <Post {...latest.node} />
      <SEO />
      <h2>All posts</h2>
      <ul>
        {data.posts.edges
          .filter(({ node }) => !node.frontmatter.rss_only)
          .map(({ node }) => (
            <li key={node.fields.slug}>
              <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
              {` - ${node.fields.dateWithYear}`}
            </li>
          ))}
      </ul>
      <About />
    </Layout>
  );
}

export const indexQuery = graphql`
  query IndexQuery {
    posts: allMarkdownRemark(sort: { fields: [fields___date], order: DESC }) {
      edges {
        node {
          ...PostDetails
        }
      }
    }
  }
`;
