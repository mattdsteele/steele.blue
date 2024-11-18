import { getVideoType } from './mdit-video-embed.js';

const videos = [
  'youtube:https://www.youtube.com/embed/CVTcbvhI0GU',
  'youtube:https://www.youtube.com/embed/BxV14h0kFs0',
  'youtube:https://www.youtube.com/embed/uWzkK7tUjaU',
  'youtube:https://www.youtube.com/embed/iqXJv3f0VhE',
  'youtube:https://www.youtube.com/watch?v=tNagjSGzJYA',
  'youtube:https://www.youtube.com/embed/2x_pqyrf9lA',
  'vimeo:https://vimeo.com/99683665',
  'vimeo:https://vimeo.com/54993676',
];

const test = () => {
  videos.forEach((video) => {
    const result = getVideoType(video);
    console.log(result);
  });
};

test();
