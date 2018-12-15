const visit = require('unist-util-visit')
const sd = (_, id) => {
  return `<script async class="speakerdeck-embed" data-id="${id}" data-ratio="1.77777777777778" src="https://speakerdeck.com/assets/embed.js"></script>`
}
module.exports = ({ markdownAST }) => {
  visit(markdownAST, `inlineCode`, node => {
    if (node.value.startsWith('speakerdeck')) {
      const [_, id] = node.value.split(':')
      node.type = 'html'
      node.value = sd`${id}`
    }
  })
  return markdownAST
}
