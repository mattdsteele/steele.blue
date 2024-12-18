import { EleventyRenderPlugin } from '@11ty/eleventy';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import webcPlugin from '@11ty/eleventy-plugin-webc';
import { FlatCache } from 'flat-cache';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { inspect } from 'node:util';
import { videoEmbed } from './src/plugins/mdit-video-embed.js';

export default async function (eleventyConfig) {
  eleventyConfig.setIncludesDirectory('src');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.webc');

  eleventyConfig.addPassthroughCopy({static: '/'});
  eleventyConfig.addPassthroughCopy({
    'node_modules/lite-vimeo-embed/lite-vimeo-embed.js':
      'assets/lite-vimeo-embed.js',
    'node_modules/@justinribeiro/lite-youtube/lite-youtube.js':
      'assets/lite-youtube.js',
  });

  // RSS Only
  eleventyConfig.addCollection('nonRssPosts', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('content/blog/**.md')
      .filter((item) => {
        return !item.data.rss_only;
      });
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(webcPlugin, {
    components: 'src/components/**/*.webc',
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: 'html',
    formats: ['jpg', 'webp'],
    widths: [600, 1000, 'auto'],
    defaultAttributes: {
      decoding: 'async',
      sizes: '100vw',
      loading: 'lazy',
    },
  });

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
  eleventyConfig.addFilter('console', function (value) {
    return inspect(value);
  });
  eleventyConfig.addFilter('year', function (value) {
    return value.getFullYear();
  });
}
