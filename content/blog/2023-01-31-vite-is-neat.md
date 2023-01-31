---
layout: post
title: Vite is Neat
---

I spoke at [NebraskaJS](https://nebraskajs.com) about [Vite](https://vitejs.dev/):

`youtube:https://www.youtube.com/embed/NXCWH0syq8E`

Aside from a scratchy voice initially (and having to present remotely due to a Covid recovery), it went well! I was excited to share my excitement for ES Module-centric toolchains, and the speed they afford day-to-day development.

As an example of a Vite-driven website, I showcased the [GPS bike tracking website](/serverless-bike-gps), which used Vite on its frontend.
The UI isn't especially complicated, but it demonstrates the flexibility tools like Vite afford.
I didn't need a full framework, and most of the functionality was Vanilla JS, along with a few geospatial tools and a mapping library.

Simply going [toolchainless](/toolchainless) and using [skypack](https://www.skypack.dev/) might have been the easiest approach, but I still wanted some type-safety for the code I was authoring, and Vite offered an easy way to integrate TypeScript.

I do wonder if Vite and its tools are just steps along the path toward full [buildless development](https://modern-web.dev/guides/going-buildless/getting-started/).
It's exciting to see tools embracing new primitives, while also meeting developers where they're at, and enabling productivity along the way.