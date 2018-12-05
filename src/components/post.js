import React from 'react'

export default function Post({ frontmatter, fields, html }) {
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <h2>{fields.dateWithDay}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
