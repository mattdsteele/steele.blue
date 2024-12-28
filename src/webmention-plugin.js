import { groupBy } from "lodash-es";

export default function(eleventyConfig) {
    eleventyConfig.addFilter('webmentionsForUrl', (webmentions, url) => {
        const mentions = webmentions[url]
        if (mentions) {
            const mentionsForPage = groupBy(mentions, 'wm-property');
            if (mentionsForPage['in-reply-to']) {
              mentionsForPage['in-reply-to'] = mentionsForPage['in-reply-to'].sort(
                (a, b) => a.published.localeCompare(b.published)
              );
            }
            return mentionsForPage;
        }
    });
}