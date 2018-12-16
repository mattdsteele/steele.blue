import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';

import './header.css';

const headerQuery = graphql`
  {
    site {
      siteMetadata {
        author
      }
    }
  }
`

function Header() {
  return (
    <StaticQuery
      query={headerQuery}
      render={data => (
        <header className="header"
      >
        <div
          className="header--container"
        >
          <h1 className="header--title">
            <Link
              className="header--link"
              to="/"
            >
              {data.site.siteMetadata.author}
            </Link>
          </h1>
        </div>
      </header>
      )}
    />
  )
}

export default Header;
