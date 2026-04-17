---
layout: post
title: This blog's comments are powered by Webmentions
---

[Webmentions](https://indieweb.org/Webmention) are a cool, standards-compliant mechanism to let your corner of the Web interact with other sites. What better way to add a comments system to my new [Eleventy-powered blog](/gatsby-to-eleventy)?

At its core, Webmentions are just a means for one site to notify another that it's been mentioned.
That said, webmentions aren't the most intuitive concept to grasp, and implementing them requires additional consideration.

# Collecting mentions

Webmentions are sent via simple HTTP message with a `source` and `target` parameter. These are discovered based on a `<link>` tag on your page. You can host this endpoint yourself, but I'm using the excellent [Webmention.io](https://webmention.io/) to capture all webmentions for my domain:

```html
<link rel="webmention" webc:keep href="https://webmention.io/steele.blue/webmention" />
```

Webmention.io provides an API that returns all the mentions for a page (or domain).
I hit this at build-time, and create a new Eleventy collection with all the entries:

```javascript
const url = `https://webmention.io/api/mentions.jf2?token=${apiKey}&per-page=1000`;

export default async () => {
  const data = await EleventyFetch(url, { duration: '1d', type: 'json' });
  const grouped = groupBy(data.children, 'wm-target');
  const baseData = {};
  for (const key of Object.keys(grouped)) {
    baseData[content(key)] = grouped[key];
  }
  return baseData;
};
```

# Displaying Webmentions

On each page, I include a Liquid component that finds any Webmentions for the URL, and renders each category (likes/reposts/comments):

![Example of reposts/likes/webmentions on a blog post](/content/images/webmentions.png)

This felt like the perfect place for a WebC-based component, but I ran into issues as I needed to pass in complex data as props, which isn't supported.
Luckily WebC lets you mix in other templating languages, again showcasing its flexibility and pragmatism.

Since this only gets generated at build-time, it doesn't capture new mentions until I rebuild the site, which is fine for me. If you want more dynamism; you could setup a cron job to rebuild their site daily to pull in new mentions.

Webmention.io also supports [outgoing webhooks](https://webmention.io/settings/webhooks), so you could directly trigger a rebuild when a new mention comes in.

And some people just pull in webmentions by fetching them client-side, and rendering interactions via JavaScript.
[Seia](https://seia.js.org/) looks like a pretty straightforward Web Component providing drop-in support with Webmention.io.

# Bridging from the Fediverse

Surprisingly, not 100% of online communication occurs via sites sending webmentions to each other.
We'd also like to capture comments occurring on Mastodon (or other channels), even if they don't natively support webmentions.
In IndieWeb parlance, this is known as a [backfeed](https://indieweb.org/backfeed).

I'm using Ryan Barrett's [Bridgy](https://brid.gy/about) service for this.
You can authorize Bridgy to poll your Mastodon account (or social networks) to discover likes/reposts/replies to your toots, and send them back to your site as Webmentions.

In addition, the Bridgy Cinematic Universe supports a number of other features, including posting to Mastodon when you publish new blog entries.
And [Bridgy Fed](https://fed.brid.gy/) lets you create Mastodon/Bluesky/Indieweb accounts from any other permutation; a great way to implement [POSSE](https://indieweb.org/POSSE).

# Sending Outgoing Webmentions

As I'm writing posts, I want to send Webmentions to other sites which I reference. This requires a different set of tools, but again the Indieweb has provided a solid foundation to build atop.

I'm using Remy Sharp's `webmention` CLI tool, which parses my existing Atom feed, finds all links which support mentions, and delivers a webmention to each.

As noted in his [introductory post](https://remysharp.com/2019/06/18/send-outgoing-webmentions):

> The ability to send Webmentions needs to be a part of an automated workflow - the same way as posting a new WordPress blog post automatically sent pingbacks.

I use a GitHub Action to trigger this, via a single line addition to my existing build:

```yml
- run: npx webmention _site/atom.xml --limit 1 --send
```

You can create a more robust interactivity by enhancing your page's markup with [microformats](https://indieweb.org/microformats), enabling [comments](https://indieweb.org/comments#How_to_display) and more.

# TMTOWTDI

One exciting facet to integrating Webmentions into your workflow is that there's no one best way to do it.
You can use existing tools and services to collect and deliver mentions, or customize them to your own liking.

This does make for a more complicated, "choose your own adventure" aspect to the process, but I find this to be a feature, not a bug.
Mixing prebuilt tools with my own code has given me a better understanding of what works well and what I could improve on in the future.
I can optimize for certain aspects (like zero-runtime JavaScript) when they tradeoff with others (real-time updates), while using the same protocol as someone who would make a different choice.

I found these sites valuable:

* Keith Grant's [Adding webmentions to a static site](https://keithjgrant.com/posts/2019/02/adding-webmention-support-to-a-static-site/)
* Bob Monsour's [Adding webmentions to my site](https://web.archive.org/web/20250117233922/https://bobmonsour.com/blog/adding-webmentions-to-my-site/)
* Robb Knight's [Adding Webmentions to your Site](https://rknight.me/blog/adding-webmentions-to-your-site/)
* Paul Kinlan's [Using Web Mentions in a static site](https://paul.kinlan.me/using-web-mentions-in-a-static-sitehugo/)
* Max Böck's [Using Webmentions in Eleventy](https://mxb.dev/blog/using-webmentions-on-static-sites/)
* Sia Karamalegos [An In-Depth Tutorial of Webmentions + Eleventy](https://sia.codes/posts/webmentions-eleventy-in-depth/)

# Send me a Mention

So how do you actually comment on this post? You've got a few options:

Reply to me [on the Fediverse](https://carhenge.club/@mattdsteele), and your post will show up here.

Or even better, write a blog post of your own and send me an outgoing webmention.
Websites: the cool and underground social network that you shouldn't sleep on in 2025.
