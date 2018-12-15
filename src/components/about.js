import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

export default function About() {
  return (
    <StaticQuery
      query={aboutQuery}
      render={data => {
        const { author, location, social } = data.site.siteMetadata;
        return (
          <p>
            I'm {author}, a programmer living in {location}. You can find me on{' '}
            <a href={`https://github.com/${social.github}`}>GitHub</a> and{' '}
            <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>.
          </p>
        );
      }}
    />
  );
}

const aboutQuery = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        author
        location
        social {
          github
          twitter
        }
      }
    }
  }
`;
