---
title: Generating OpenGraph Cards with Gatsby and the 11ty Screenshot Service
---

I made the sharable [OpenGraph images](https://www.opengraph.xyz/) on this site better by generating custom cards contextual to each post:

![OpenGraph social card for blog post](https://v1.opengraph.11ty.dev/https%3A%2F%2Fsteele.blue%2Fmoving-owncast-followers-fediverse%2F/)

The core concept is to create a sidecar page for each post that looks like an OpenGraph card, then take a snapshot of the page, and set it as the `og:image` meta tag on the original post.

There are a [few Gatsby plugins](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-social-cards/) that attempt to help, but they rely on Puppeteer to generate screenshots at build-time, which can slow down a build pretty significantly, and adds a heavy dependency to the toolchain.

The approach I took leverages Gatsby's dynamic page generation, but leaves the image rendering to external services, only generating as-needed at runtime.

You can [view the generated card for this post](./social-card/) to get a feel for what's getting generated, and see a full implementation diff [here](https://github.com/mattdsteele/steele.blue/compare/f1fcdf0955fb6c4211c4d8073fc16024b3377572...5e2cd5047619d4da85c3a2809364dd1b1a47ed5c).

# React Card Component

Like other Gatsby pages, this is a React component you'll set props via Gatsby. I placed it in `components/social-card.js`.
Since OpenGraph images are generally a fixed size, you can target your design for those specific dimensions.

```jsx
import React from 'react';

// It's a Gatsby component, so pull in whatever assets are useful for the page
import avatar from '../../content/images/avatar-transparent.png';

// I'm using CSS Modules for styles, but you do you
import { card, cardTitle, cardExcerpt, cardDate, cardMetadata, cardAuthor, cardAvatar, cardTransparency } from './social-card.module.css';

const SocialCard = ({ pageContext: { title, excerpt, date } }) => {
  return (
    <main className={card}>
      <h1 className={cardTitle}>{title}</h1>
      <p className={cardExcerpt}>{excerpt}</p>
      <img className={cardAvatar} src={avatar} alt="Avatar" />
      <div className={[cardMetadata, cardTransparency].join(' ')}>
        <p className={cardDate}>{date}</p>
        <p className={cardAuthor}>steele.blue</p>
      </div>
    </main>
  );
};

export default SocialCard;
```

# Gatsby Card Pages

In `gatsby-node.js`, enhance the `onCreateNode` method (or wherever you're currently calling `createPage`) to generate a new page, which will be for your component's social card.

First, query for all blog posts, pulling the props you'll want:

```js
  // Query for all blog posts
const socialCardQuery = await graphql(`
{
  allMarkdownRemark {
    nodes {
      excerpt
      fields {
        slug
        date(formatString: "MMM DD")
      }
      frontmatter {
        title
      }
    }
  }
}
`).then((res) => res.data);
```

Then create a Social Card page for each post, passing in the relevant props:
```js
const pageContexts = socialCardQuery.allMarkdownRemark.nodes.map((node) => {
  return {
    slug: node.fields.slug,
    pageContext: {
      title: node.frontmatter.title,
      excerpt: node.excerpt,
      date: node.fields.date,
    },
  };
});

const socialCard = path.resolve('src/components/social-card.js');
pageContexts.forEach((page) => {
createPage({
    component: socialCard,
    path: `${page.slug}/social-card`,
    context: {
    ...page.pageContext,
    },
});
});
```

Once these are getting generated, you can just add `/social-card` to the end of any permalink to see what's getting generated, and iterate until you're happy.

# OpenGraph Screenshots via 11ty API

Ultimately OpenGraph expects an image, and we currently have a website.
Fortunately for us, the Eleventy project supports a service that will [generate screenshots of pages via URLs](https://www.11ty.dev/docs/services/screenshots/), with presets for OpenGraph dimensions.

In your blog posts, you'll want to define the `og:image` meta tag based on these properties. Here I'm using React Helmet, but you could also do it with the [Gatsby Head API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/).

```jsx
// Helper methods to configure the Eleventy Screenshot Service
const socialCardUrl = (url) => `${url}/social-card/`;
const screenshotUrl = (uri) => {
  const encoded = encodeURIComponent(socialCardUrl(uri));
  
  // https://github.com/11ty/api-screenshot/#manual-cache-busting
  const cacheBust = new Date().getTime();
  return `https://v1.screenshot.11ty.dev/${encoded}/opengraph/_${cacheBust}`;
};

// Then in your blog post's component, set the value:
<Helmet
  meta={[
    {
    property: 'og:image',
    content: screenshotUrl(url),
    },
    // etc
  ]}
/>
```

And with that, you're off to the races! As Zach put it, perhaps folks will start clicking on my posts [if I work really hard on the OpenGraph images](https://www.zachleat.com/web/automatic-opengraph/).

