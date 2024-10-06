export default {
    tags: ['posts'],
    permalink: function(data) {
        return `${data.page.fileSlug}/index.html`
    }
}