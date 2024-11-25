export default {
  tags: ['posts'],
  permalink: function (data) {
    return `${data.page.fileSlug}/index.html`;
  },
  eleventyComputed: {
    postDate: ({ page }) => {
      return new Intl.DateTimeFormat('en-us', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(page.date);
    },
  },
};
