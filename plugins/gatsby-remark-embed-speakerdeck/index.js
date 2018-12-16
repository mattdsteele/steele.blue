const visit = require('unist-util-visit');

const speakerDeckEmbed = id => {
  const props = [
    `src="//speakerdeck.com/player/${id}"`,
    `allowfullscreen`,
    `scrolling="no"`,
    `allow="autoplay; encrypted-media"`,
    `width="600"`,
    `height="400"`
  ]

  return `<iframe ${props.join(' ')}></iframe>`;
}

module.exports = ({ markdownAST }) => {
  visit(markdownAST, `inlineCode`, node => {
    if (node.value.startsWith('speakerdeck')) {
      const [_, id] = node.value.split(':')
      node.type = 'html'
      node.value = speakerDeckEmbed(id)
    }
  })
  return markdownAST
}
