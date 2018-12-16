import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';

import styles from './header.module.css';

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
      render={data => (
        <header className={styles.header}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              <Link className={styles.link} to="/">
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
