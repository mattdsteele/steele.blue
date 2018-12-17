import styles from './rss-club.module.css';
import React from 'react';

export default () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.exclusive}>
        <a href="/rss-club">RSS Club Exclusive.</a>
      </p>
    </div>
  );
};
