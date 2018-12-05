const path = require('path')
const slugify = require('limax')

exports.onCreateNode = function onCreateNode({ actions, node }) {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    createNodeField({
      node,
      name: 'slug',
      value: `/${slugify(node.frontmatter.title)}`
    })

    const fileName = path.basename(node.fileAbsolutePath)
    const date = fileName.match(/^[\d-]+/).pop().slice(0, -1)
    createNodeField({
      node,
      name: 'date',
      value: date
    })
  }
}

exports.createPages = async function createPages({ actions, graphql }) {
  const { createPage, createNodeField } = actions
  const result = await graphql(`
    {
      posts:allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
    .then(res => res.data)

  const postTemplate = path.resolve('src/templates/blog-post.js')
  result.posts.edges.forEach(({ node }) => {
    const { slug } = node.fields
    createPage({
      component: postTemplate,
      path: slug,
      context: {
        slug
      }
    })
  })
}
