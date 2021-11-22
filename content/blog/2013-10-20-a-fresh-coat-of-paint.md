---
title: A fresh coat of paint
layout: post
---

After years of using my website as a [glorified landing page](https://web.archive.org/web/20131110185340/http://dynamic.matthew-steele.com:80/) to other content, I've taken the time to build something proper.
The link dump is gone, and I've moved my blog from WordPress.com to my domain. [The site is also available on GitHub](https://github.com/mattdsteele/matthew-steele.com).

**Google Reader expatriates: update your RSS feeds: [http://www.matthew-steele.com/feed/atom.xml](https://web.archive.org/web/20131110185405/http://www.matthew-steele.com:80/feed/atom.xml)**

## Why redesign?

A few reasons:

- Link dumps are lame. The meat of this site is on the blog, so it makes sense to show that up front. [No one likes to wait while they wait](https://web.archive.org/web/20131005120649/http://www.lukew.com/ff/entry.asp?1458).
- I began using WordPress.com 6 years ago, when I was working mostly on the back-end and didn't want to think about website layouts or CSS. Times have changed.
- It's theraputic. I might be the only person who finds joy in moving periodically in the physical world. It's a great time to trash old artifacts and make way for the new.

It's said that gearheads never have their own car in working condition. Car enthusiasts always have some project they're working on, and use their personal ride as a experiment.
_I wanted a place to experiment on my own._

## Goodbye to all that

I went with a "wait until it's needed" approach for most content. The site is _JavaScript free_ (save Google Analytics) and doesn't include any CSS libraries.
I love jQuery, Modernizr and Bootstrap, but sometimes the only tools you need are your bare hands.

This has resulted in a substantial shrinking of page weight. A text-only post on this platform is fully _86% lighter on page load_ than its WordPress cousin.

I've also held off on including comments. I like the idea of hashing out conversations elsewhere (like Twitter or Google+) and then writing a new post with the results.
If that doesn't work out, Disqus is a simple solution.

## Breaking it down

I've ditched WordPress, PHP, and databases. _The site is now 100% statically generated and hosted on Amazon S3._ Building it has been exciting.

[Jekyll](https://jekyllrb.com/) generates the static site, and I'm using [Grunt](https://gruntjs.com/) to automate many of the other tasks needed to build the site.
I first heard of this combo from [Zach Leatherman's redesign](https://www.zachleat.com/web/zachleat-is-dead/), and it seemed ingenious.
Even though the tools are written in different languages, they play really nicely thanks to the [grunt-shell](https://github.com/sindresorhus/grunt-shell) plugin.

Grunt automates everything. Compiling LESS files, running a local server, deployments to Amazon S3; all a `grunt` command away.

Posts are written in Markdown, which _feels_ right and lets me blog in Vim.

While designing, I went _mobile-first and responsive_. With such a simple static page, I was able to just pull up `localhost` on the iOS simulator and my Android tablet and call it good.
It also simplified my CSS by a pretty substantial amount.

Since I now have control over the layout, I also took the time to add an [I Live in Omaha](http://iliveinomaha.com/) banner to the page.
There's an `<img>` version of the banner, but I decided to rewrite it using pure HTML and CSS3. This made it responsive and Retina-sharp.
On small screens, it's a footer at the bottom of the site. As you gain more real estate, it jumps to the top of the page, and eventually gets fixed to the top.
Since it's progressively enhanced, this also avoids many of the [issues with position:fixed](http://bradfrostweb.com/blog/mobile/fixed-position/) on mobile devices.

## Talk amongst yourselves

Let me know what you think. [I'm on Twitter.](https://twitter.com/mattdsteele/)
