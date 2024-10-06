import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';
import { container } from './layout.module.css';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className={container}>{children}</main>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
