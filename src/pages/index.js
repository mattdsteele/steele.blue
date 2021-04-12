import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import Post from '../components/post';
import SEO from '../components/seo';
import About from '../components/about';

import { date } from './index.module.css';

export default function IndexPage({ data }) {
  const [latest] = data.posts.edges;
  return (
    <Layout>
      <Post {...latest.node} />
      <SEO />
      <h2>All posts</h2>
      <ul
        style={{
          listStyleType: 'none',
          margin: 0,
        }}
      >
        {data.posts.edges.map(({ node }) => (
          <li key={node.fields.slug}>
            <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
            <span className={date}>{` - ${node.fields.dateWithYear}`}</span>
          </li>
        ))}
      </ul>
      <About />
    </Layout>
  );
}

export const indexQuery = graphql`
  query IndexQuery {
    posts: allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { rss_only: { ne: true } } }
    ) {
      edges {
        node {
          ...PostDetails
        }
      }
    }
  }
`;
