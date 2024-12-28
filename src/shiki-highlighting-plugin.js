import { FlatCache } from 'flat-cache';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { videoEmbed } from './plugins/mdit-video-embed.js';

export default async function(eleventyConfig) {
  // syntax highlighting
  // via https://www.hoeser.dev/blog/2023-02-07-eleventy-shiki-simple/
  // and https://stefanzweifel.dev/posts/2024/06/03/how-i-use-shiki-in-eleventy/
  eleventyConfig.amendLibrary('md', () => {});

  eleventyConfig.on('eleventy.before', async () => {
    const shiki = await import('shiki');

    const highlighter = await shiki.createHighlighter({
      themes: ['dark-plus', 'light-plus'],
      langs: [
        'js',
        'html',
        'bash',
        'sql',
        'jsx',
        'yaml',
        'ts',
        'dockerfile',
        'xml',
        'go',
        'c',
        'c++',
        'python',
      ],
      langAlias: {
        Dockerfile: 'dockerfile',
        'c++': 'cpp',
      },
    });
    const cache = new FlatCache({cacheDir: resolve('.cache/shiki')});
    eleventyConfig.amendLibrary('md', (mdLib) => {
      mdLib.set({
        highlight: (code, lang) => {
          const hash = createHash('md5').update(code).digest('hex');
          const cachedValue = cache.getKey(hash);

          if (cachedValue) {
            return cachedValue;
          }

          const html = highlighter.codeToHtml(code, {
            lang,
            themes: { light: 'light-plus', dark: 'dark-plus' },
          });
          cache.setKey(hash, html);
          cache.save();
          return html;
        },
      });
      mdLib.use(videoEmbed);
      return mdLib;
    });
  });

}