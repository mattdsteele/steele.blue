import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        title
        author
        description
        gravatar
        siteUrl
        social {
          twitter
        }
      }
    }
  }
`;

function SEO({ meta, title, description, slug, keywords }) {
  return (
    <StaticQuery
      query={query}
      render={data => {
        const { siteMetadata } = data.site;
        const metaDescription = description || siteMetadata.description;
        const url = `${siteMetadata.siteUrl}${slug}`;
        return (
          <Helmet
            htmlAttributes={{ lang: 'en' }}
            {...(title
              ? {
                  titleTemplate: `%s - ${siteMetadata.author}`,
                  title,
                }
              : {
                  title: siteMetadata.author,
                })}
            meta={[
              {
                name: 'description',
                content: metaDescription,
              },
              {
                property: 'og:url',
                content: url,
              },
              {
                property: 'og:title',
                content: title,
              },
              {
                name: 'og:description',
                content: metaDescription,
              },
              {
                property: 'og:image',
                content: siteMetadata.gravatar,
              },
              {
                name: 'twitter:card',
                content: 'summary',
              },
              {
                name: 'twitter:creator',
                content: siteMetadata.social.twitter,
              },
              {
                name: 'twitter:title',
                content: title,
              },
              {
                name: 'twitter:description',
                content: metaDescription,
              },
              {
                name: 'twitter:image:src',
                content: siteMetadata.gravatar,
              },
            ]
              .concat(
                keywords
                  ? {
                      name: 'keywords',
                      content: keywords.join(', '),
                    }
                  : []
              )
              .concat(meta)}
          />
        );
      }}
    />
  );
}

SEO.defaultProps = {
  meta: [],
  title: '',
  slug: '',
};

SEO.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  meta: PropTypes.array,
  slug: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default SEO;
