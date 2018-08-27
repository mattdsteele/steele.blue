---
layout: post
title: Web Components Aren't Weird Anymore
---

I gave a talk at [Barcamp Omaha](https://barcampomaha.org/) on Web Components:

{% youtube CVTcbvhI0GU %}

In it, I tried to first answer the question: **why aren't Web Components as popular as React?**
They both offer reusable components; building blocks which let you assemble sites easily and without rework.
But React (and Vue, Angular, etc) took off, and Web Components never did. Why aren't we Using The Platform (tm)?

There are a number of factors, but my take: for nearly their entire existence, Web Components were **super weird** to use.

A few years ago, to get a Web Component on the screen, you had to:

* Load up four giant (and slow) polyfills, because only Chrome implemented it natively
* Use them via the Polymer framework, which looked different than your current codebase and didn't interop with it easily
* Pull them in via bespoke (HTML imports) and outdated (Bower) methods
* Bundle them using Vulcanizer and other tools that don't work with Webpack

This sucks! And even if you were sold on the promise of Web Components, a person can only take so much weirdness before they give up and move onto a reliable toolchain.

But over the last year, Web Components have slowly lost their weirdness. Because the controversial parts of the spec were jettisoned:

* They've been implemented in all mobile and most desktop browsers
* You can use standard tools like NPM and Webpack to build and publish your components
* They [interop seamlessly](http://custom-elements-everywhere.com/) with most frameworks 
* Your framework probably exports them (Angular, Vue, and Dojo do natively; and React can with a wrapper)
* There's lots of "Web Component Native" frameworks beyond Polymer, including my favorite [Stencil](http://stenciljs.com/)

We're finally at the point were it's **easier** to add a Custom Element into any app than it is a React component. Now that's weird.