import { wrapper, exclusive } from './rss-club.module.css';
import React from 'react';

export default () => {
  return (
    <div className={wrapper}>
      <p className={exclusive}>
        <a href="/rss-club">RSS Club Exclusive.</a>
      </p>
    </div>
  );
};
