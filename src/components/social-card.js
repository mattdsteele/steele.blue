import React from 'react';
import {
  card,
  cardTitle,
  cardExcerpt,
  cardDate,
  cardMetadata,
  cardAuthor,
  cardAvatar,
  cardTransparency
} from './social-card.module.css';
import avatar from '../../content/images/avatar-transparent.png';

const SocialCard = ({ pageContext: { title, excerpt, slug, date } }) => {
  return (
    <main className={card}>
      <h1 className={cardTitle}>{title}</h1>
      <p className={cardExcerpt}>{excerpt}</p>
      <img className={cardAvatar} src={avatar} alt="Avatar" />
      <div className={[cardMetadata, cardTransparency].join(' ')}>
        <p className={cardDate}>{date}</p>
        <p className={cardAuthor}>steele.blue</p>
      </div>
    </main>
  );
};

export default SocialCard;
