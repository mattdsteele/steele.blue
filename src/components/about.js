import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import './about.css';

export default function About() {
  return (
    <StaticQuery
      query={aboutQuery}
      render={data => {
        const { author, location, social } = data.site.siteMetadata;
        return (
          <p className="about">
            I'm {author}, a programmer living in {location}. You can find me on{' '}
            <a className="about--link" href={`https://github.com/${social.github}`}>GitHub</a> and{' '}
            <a className="about--link" href={`https://twitter.com/${social.twitter}`}>Twitter</a>.
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
