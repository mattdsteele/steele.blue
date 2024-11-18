import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import webcPlugin from '@11ty/eleventy-plugin-webc';
import { EleventyRenderPlugin } from '@11ty/eleventy';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { FlatCache } from 'flat-cache';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import { videoEmbed } from './src/plugins/mdit-video-embed.js';

export default async function (eleventyConfig) {
  eleventyConfig.setIncludesDirectory('src');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  // RSS Only
  eleventyConfig.addCollection('nonRssPosts', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('content/blog/**.md')
      .filter((item) => {
        return !item.data.rss_only;
      });
  });

  // TODO write a converter
  eleventyConfig.amendLibrary('md', (mdLib) => {
    // mdLib.use(youtubeLitePlugin);
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(webcPlugin, {
    components: 'src/components/**/*.webc',
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: 'html',
    formats: ['jpg'],
    widths: [600, 1000],
    defaultAttributes: {
      sizes: '100vw',
      loading: 'lazy',
    },
  });

  // syntax highlighting
  // via https://www.hoeser.dev/blog/2023-02-07-eleventy-shiki-simple/
  // and https://stefanzweifel.dev/posts/2024/06/03/how-i-use-shiki-in-eleventy/
  // empty call to notify 11ty that we use this feature
  // eslint-disable-next-line no-empty-function
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

  eleventyConfig.addPlugin(feedPlugin, {
    type: 'atom',
    outputPath: '/atom.xml',
    collection: {
      name: 'posts',
      limit: 0
    },
    metadata: {
      language: 'en',
      title: 'Matt Steele',
      subtitle: 'The personal blog of Matt Steele',
      base: 'https://steele.blue',
      author: {
        name: 'Matt Steele',
        email: 'matt@steele.blue'
      }
    }
  })
}
