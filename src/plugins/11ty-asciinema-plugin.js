import { asciinema } from './mdit-asciinema.js';

export default async function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(asciinema);
  });
}
