import markdownIt from 'markdown-it';

console.log('loading config')
export default async function(eleventyConfig) {
    eleventyConfig.setIncludesDirectory('src');
    eleventyConfig.setLibrary("md", markdownIt({html: true}));
    console.log('running config')
    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
    console.log('done')

}