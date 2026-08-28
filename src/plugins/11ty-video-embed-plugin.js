import { videoEmbed } from './mdit-video-embed.js';

export default async function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(videoEmbed);
  });
}
