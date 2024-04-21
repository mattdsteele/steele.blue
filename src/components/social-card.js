import React from 'react';
import {
  card,
  cardTitle,
  cardExcerpt,
  cardDate,
  cardMetadata,
  cardAuthor,
  cardAvatar,
  verticalCenter,
  cardTransparency
} from './social-card.module.css';
import avatar from '../../content/images/profile-avi-transparent.png';

const SocialCard = ({ pageContext: { title, excerpt, date } }) => {
  return (
    <main className={card}>
      <h1 className={[cardTitle, cardTransparency, verticalCenter].join(' ')}>{title}</h1>
      <p className={[cardExcerpt, cardTransparency, verticalCenter].join(' ')}>{excerpt}</p>
      <img className={cardAvatar} src={avatar} alt="Avatar" />
      <div className={[cardMetadata, cardTransparency].join(' ')}>
        <p className={cardDate}>{date}</p>
        <p className={cardAuthor}>steele.blue</p>
      </div>
    </main>
  );
};

export default SocialCard;
