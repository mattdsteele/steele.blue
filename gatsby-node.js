const path = require('path');

exports.onCreateNode = function onCreateNode({ actions, node }) {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const fileName = path.basename(node.fileAbsolutePath);
    const splitFiles = /(^[\d-]+)(.*)\.m/g.exec(fileName);
    const slug = splitFiles[2];
    createNodeField({
      node,
      name: 'slug',
      value: `/${slug}`,
    });

    const date = fileName
      .match(/^[\d-]+/)
      .pop()
      .slice(0, -1);
    createNodeField({
      node,
      name: 'date',
      value: date,
    });
  }
};


async function createPosts(graphql, createPage) {
  const result = await graphql(`
    {
      posts: allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then((res) => res.data);

  const postTemplate = path.resolve('src/templates/blog-post.js');
  result.posts.edges.forEach(({ node }) => {
    const { slug } = node.fields;
    createPage({
      component: postTemplate,
      path: slug,
      context: {
        slug,
      },
    });
  });
}

async function createSocialCards(graphql, createPage) {
  const socialCardQuery = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          excerpt
          fields {
            slug
            date(formatString: "MMM DD")
          }
          frontmatter {
            title
          }
        }
      }
    }
  `).then((res) => res.data);

  const pageContexts = socialCardQuery.allMarkdownRemark.nodes.map((node) => {
    const slugWithoutSlashes = node.fields.slug.replace(/\//g, '');
    return {
      slug: node.fields.slug,
      pageContext: {
        title: node.frontmatter.title,
        excerpt: node.excerpt,
        slug: node.fields.slug,
        date: node.fields.date,
      },
    };
  });
  const socialCard = path.resolve('src/components/social-card.js');
  pageContexts.forEach((page) => {
    createPage({
      component: socialCard,
      path: `${page.slug}/social-card`,
      context: {
        ...page.pageContext,
      },
    });
  });
}

exports.createPages = async function createPages({ actions, graphql }) {
  const { createPage, createNodeField } = actions;
  await createPosts(graphql, createPage);
  await createSocialCards(graphql, createPage);
};