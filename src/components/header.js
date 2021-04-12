import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';

import { header, container, title, link } from './header.module.css';

const headerQuery = graphql`
  {
    site {
      siteMetadata {
        author
      }
    }
  }
`;

function Header() {
  return (
    <StaticQuery
      query={headerQuery}
      render={(data) => (
        <header className={header}>
          <div className={container}>
            <h1 className={title}>
              <Link className={link} to="/">
                {data.site.siteMetadata.author}
              </Link>
            </h1>
          </div>
        </header>
      )}
    />
  );
}

export default Header;
