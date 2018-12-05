const title = 'steele.blue'

module.exports = {
  siteMetadata: {
    title,
    author: 'Matt Steele',
    url: 'http://steele.blue',
    description: 'The personal website of Matt Steele',
    location: 'Omaha, Nebraska',
    social: {
      github: 'mattdsteele',
      twitter: 'mattdsteele'
    }
  },
  plugins: [
    'gatsby-plugin-react-helmet',
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
          'gatsby-remark-responsive-iframe',
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 600,
            },
          },
          'gatsby-remark-prismjs'
        ]
      }
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
      },
    },
  ],
}
