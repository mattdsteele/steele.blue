import React from 'react';
import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import RssClub from './rss-club';

import { title, date, content } from './post.module.css';

function Post({ frontmatter, fields, html, showLink }) {
  let postTitle = frontmatter.title;
  if (fields.slug && showLink) {
    postTitle = <Link to={fields.slug}>{frontmatter.title}</Link>;
  }
  return (
    <article>
      <h1 className={title}>{postTitle}</h1>
      <h2 className={date}>{fields.dateWithDay}</h2>
      {frontmatter.rss_only ? <RssClub /> : null}
      <div className={content} dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

Post.defaultProps = {
  showLink: true,
};

Post.propTypes = {
  showLink: PropTypes.bool,
};

export default Post;

export const postFragment = graphql`
  fragment PostDetails on MarkdownRemark {
    fields {
      dateWithDay: date(formatString: "DD MMM YYYY")
      dateWithYear: date(formatString: "MMM YYYY")
      slug
    }
    frontmatter {
      title
      tags
      rss_only
    }
    html
    excerpt(pruneLength: 160)
  }
`;
