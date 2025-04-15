import { EleventyRenderPlugin } from '@11ty/eleventy';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import webcPlugin from '@11ty/eleventy-plugin-webc';
import { inspect } from 'node:util';

import webmentionPlugin from './src/webmention-plugin.js';
import shikiHighlightingPlugin from './src/shiki-highlighting-plugin.js';

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

  eleventyConfig.addPlugin(shikiHighlightingPlugin);


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
      base: 'https://www.steele.blue',
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
  eleventyConfig.addFilter('pluralize', function(num, singular, plural) {
    if (num === 1) {
      return `${num} ${singular}`;
    }
    return `${num} ${plural || `${singular}s`}`;
  });
  eleventyConfig.addPlugin(webmentionPlugin);
  eleventyConfig.addBundle("css");
}
