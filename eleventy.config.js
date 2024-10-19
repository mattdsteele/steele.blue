import {eleventyImageTransformPlugin} from '@11ty/eleventy-img';

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
  eleventyConfig.amendLibrary('md', mdLib => {
    // mdLib.use(youtubeLitePlugin);
  })

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: 'html',
    formats: ['jpg'],
    widths: [600, 1000],
    defaultAttributes: {
      sizes: '100vw',
      loading: 'lazy',
    },
  });
}
