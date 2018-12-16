import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';
import styles from './layout.module.css';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className={styles.container}>
        {children}
      </main>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
