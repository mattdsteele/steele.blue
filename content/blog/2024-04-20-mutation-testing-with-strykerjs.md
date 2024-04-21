---
title: Adding Decap CMS to a Gatsby blog on Netlify
---
Like many developer blogs, steele.blue builds and deploys static pages using a build-time tool, and publishes to a static host.

I'm currently using [Gatsby](https://www.gatsbyjs.com/) as my SSG and [Netlify](https://www.netlify.com/) as my deploy host, though I'm not sure how much longer I'll be sticking with them.

* Blurbs about Gatsby development slowing down
* Netlify pivoting away from JAMstack

This isn't an acute issue - the site is still running, and is small enough that porting it somewhere else wouldn't be a grandiose task. But it's still just big enough to be a little daunting.

An incremental step to decoupling myself from these specific tools is, you guessed it, another tool.

* Configuring Decap for existing site
* Auth
* Image processing
