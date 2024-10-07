
export default async function(eleventyConfig) {
    eleventyConfig.setIncludesDirectory('src');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
    
    // RSS Only
    eleventyConfig.addCollection('nonRssPosts', function (collectionApi) {
      return collectionApi.getFilteredByGlob('content/blog/**.md').filter((item) => {
        return item.data.rss_only !== true;
    });
    });
}