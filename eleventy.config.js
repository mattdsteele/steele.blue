
export default async function(eleventyConfig) {
    eleventyConfig.setIncludesDirectory('src');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

}