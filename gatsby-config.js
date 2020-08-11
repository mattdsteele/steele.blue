const { node } = require('prop-types');

const title = 'steele.blue';

const config = {
  siteMetadata: {
    title,
    author: 'Matt Steele',
    siteUrl: 'http://steele.blue',
    gravatar:
      'http://www.gravatar.com/avatar/911466eedb687b909f7e66816223ceb2.png?s=400',
    description: 'The personal website of Matt Steele',
    location: 'Omaha, Nebraska',
    social: {
      github: 'mattdsteele',
      twitter: 'mattdsteele',
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-twitter',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/util/typography.js',
        omitGoogleFont: true,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/content/images`,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-embed-speakerdeck',
          {
            resolve: 'gatsby-remark-embed-video-lite',
            options: {},
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 768,
              withWebp: true,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
        ],
      },
    },
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png',
        include_favicon: false, // This will exclude favicon link tag
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, posts } }) => {
              return posts.edges.map(({ node }) => {
                const url = `${site.siteMetadata.siteUrl}/${node.fields.slug}`;
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.fields.date,
                  url,
                  guid: url,
                  custom_elements: [
                    {
                      content_encoded: node.html,
                    },
                  ],
                });
              });
            },
            query: `
            {
              posts:allMarkdownRemark(sort:{fields:[fields___date], order:DESC}) {
                edges {
                  node {
                    excerpt
                    html
                    fields {
                      date(formatString: "DD MMM YYYY HH:mm:ss ZZ")
                      slug
                    }
                    frontmatter {
                      title
                    }
                  }
                }
              }
            }
          `,
            output: '/feed/atom.xml',
            title: `Matt Steele`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-30572618-1',
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
      },
    },
    'gatsby-plugin-no-javascript',
  ],
};

if (process.env.NODE_ENV !== 'production') {
  config.plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `drafts`,
      path: `${__dirname}/content/drafts`,
    },
  });
}

module.exports = config;
