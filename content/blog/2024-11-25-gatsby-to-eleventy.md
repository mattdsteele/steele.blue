---
layout: post
title: From Gatsby to Eleventy
---

I try not to rebuild my site too frequently, as it's one of the classic blunders, alongside getting involved in a land war in Asia. But the [Six-Year Itch](https://en.wikipedia.org/wiki/Six-year_itch) is real, and it was time for a change.

## The (Not So Great) Gatsby

My site has been powered by Gatsby since Dustin Schau (former coworker and Gatsby emeritus) [ported it over](https://github.com/mattdsteele/steele.blue/pull/20) as an early Christmas gift in 2018.
I'm not a React guy, but it was easy to work with, and I could see the appear of a framework built around collecting arbitrary sources, and unifying them into a single data structure queryable by GraphQL.

Unfortunately, Gatsby isn't in the [healthiest state these days](https://changelog.com/jsparty/325#transcript-43).
It wasn't able to achieve the liftoff that's expected from venture-funded frameworks. As it's fallen out of favor in the past few years, the OSS side of the framework has continued to languish since its acquisition by Netlify. Lately, I've spent more time fighting with dependencies than I do blogging, and it's felt more like a mill around my neck than a productive authoring tool.

![A list of PRs in GitHub referencing dependency updates](/content/images/11ty-gatsby-prs.png)

## Turning it up to Eleventy

I wanted to switch to something that's built for the long haul, and [Eleventy](https://11ty.dev) fits the charge.

Created by Nebraskan (and former coworker) Zach Leatherman, it's a static site generator with a focus on simplicity, sustainability, and not getting in your way. It's heavily inspired by Jekyll, which was how my site was [built ten years ago](/a-fresh-coat-of-paint/), so it feels like I've come full circle.

In addition to its familiarity as a tool, I appreciate what the Eleventy project prioritizes.
Rather than a laundry list of features mean to check boxes, Zach advertises [how stable its API is](https://youtu.be/bPtQmsjXMuo?si=8k_fzWNl8s2OPKks) and how easy upgrades are, with major versions focused on removing dependencies and modernizing the codebase.
I trust Zach when he says he doesn't tie Eleventy to a bundler, because he wants it to [outlive the current bundlers](https://changelog.com/jsparty/266#transcript-38).

Zach has also been at the vanguard of working through [sustainability models for Eleventy](https://www.zachleat.com/web/monetization/), as it's been maintained as an OSS passion project, to one funded by VC-backed companies, to a crowdfunded model. It's currently found a home at Font Awesome, which feels like it's finally aligned from its values, and has a history of stewarding open source projects such as [Shoelace/Web Awesome](https://changelog.com/jsparty/322).

With the recent 3.0 release of Eleventy (now powered by ES Modules), it felt like a great time to start fresh.

## From WebC to Shining WebC

I didn't want to lose out on the component model when moving off Gatsby.
I've struggled with the template-first model that Jekyll, Hugo, and other SSGs use when it's not driven by a framework.
And while I [really like Web Components](/web-components-arent-weird-anymore/), it didn't feel like the right tool for a primarily static it didn't feel like the right tool for a primarily static site, without building my own server-side rendering framework along the way.

[WebC](https://www.11ty.dev/docs/languages/webc/) is a new authoring format, loosely coupled with Eleventy, and hit the sweet spot. It's got a similar feel to Single File Component models popularized by Vue and Astro, but it outputs markup akin to Web Components.
Using WebC, I was able to rebuild most of the Gatsby components, and not feel like I was spaghettifying my codebase.

I'm using "Web Components" loosely here, as the markup is highly configurable. Most of the components simply get converted into the HTML they encapsulate, and are never generated client-side or `extend HTMLElement`.
But if you want to render components as "real" Custom Elements with [Declarative Shadow DOM](https://www.11ty.dev/docs/languages/webc/#css-and-js-(bundler-mode)), you can do so!

I'm hoping WebC sees a life beyond Eleventy projects, because it feel like a utilitarian tool designed for real problems. As it stands, this is probably the part of the codebase that's most tied to Eleventy, but if I have to rebuild the dozen-ish `.webc` files at some point, it shouldn't be too difficult to port to a 'vanilla' Custom Element, or whatever comes next.

## This Bikeshed has Fresh Paint

The site should mostly be functional, and the [URIs remain Cool](https://www.w3.org/Provider/Style/URI).
A few features are missing from the Gatsby era (namely, custom OpenGraph images), and I've done little to optimize the site. Still, I'm dangerously close to the coveted Four Hundos:


![Lighthouse score, with Performance at 99, all other metrics at 100](/content/images/11ty-lighthouse.png)

But since there's not a ton of extra cruft on the page, Eleventy pages can be fast by default, just like the web.

I had to do quite a bit of work to make my Gatsby page perform like I wanted, including applying a plugin to [delete all the client-side JavaScript](https://www.gatsbyjs.com/plugins/gatsby-plugin-no-javascript/) used to hydrate components that should have been static anyway.

It feels good, like I'm working with the grain of the Web, rather than against it. Here's to the next six years (and beyond).

<!-- Not even the first Matt Steele to have an 11ty based blog https://mattsteele.dev/ -->