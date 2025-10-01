---
layout: post
title: Source Maps in 2015
description: Source Maps are ready for prime-time.
---

I gave a talk at [NebraskaJS][nejs] about my journey with source maps:

## Video

`youtube:https://www.youtube.com/embed/Jv52vFLnn54`

## Demos

- [Sass, Concatenation, Minification](http://projects.steele.blue/source-maps/example1.html)
- [CoffeeScript, TypeScript, ECMAScript 6](http://projects.steele.blue/source-maps/example2.html)
- [ArnoldC](http://projects.steele.blue/source-maps/example3.html)

The source is available [on GitHub.](https://github.com/mattdsteele/sourcemaps-presentation/tree/master/examples)

## Slides

`speakerdeck:4f8df47ac14f48bfbf1de9ca31717f05`

# We've complected things with tools

You probably don't deploy your JavaScript or CSS to production in the same format as you write it.
Or rather, you probably shouldn't.
Maybe you're concatenating files, or minifying the assets, or even compiling from another language like Sass or CoffeeScript.
Tools like Rails' Asset Pipeline do this automatically.

But! Debugging concatenated, minified code is a huge pain.
Prior to Source Maps, the best tool available was Chrome's [Pretty Print](https://developer.chrome.com/devtools/docs/javascript-debugging#pretty-print).
But it's only a partial solution, as it doesn't restore variable names, show code transformations, etc. It's a slog working through the generated code and try to figure out what's going on.

# The solution? More tools!

I'd heard of Source Maps a few years ago.
At the time, it was being touted as the solution to the tooling problem we created.
Way back in 2012, Ryan Seddon [published an article](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) outlining all the cool stuff you could do with the technology.
But _it didn't seem to catch on_; I hardly ever noticed a site with source maps enabled.

So what gives? From my perspective, the problem wasn't with individual _tools_, it was with the _toolchain_.
If any step in your app's asset pipeline didn't properly support source maps, everything fell apart.
So while you may have source maps configured for Sass, if you then ran it against [Autoprefixer](https://github.com/postcss/autoprefixer), you're at the mercy of Autoprefixer's support.

And the more complicated your asset pipeline, the more likely one link was going to fail.
Supporting Source Maps right is _hard_. Check out the release notes for [Grunt's uglify plugin](https://github.com/gruntjs/grunt-contrib-uglify#release-history). Nearly every release in 2013 and 2014 was fixing or enhancing something with source maps.

# An end to the teething years

But I think _we're at a turning point_. For my Node-based toolchain, source maps are finally working across the board.

- Concatenate? [Added less than a year ago](https://github.com/gruntjs/grunt-contrib-concat/pull/59).
- Uglify? [Took a complete rewrite to support](https://github.com/mishoo/UglifyJS2).
- Sass? Just got consistently working maps in node-sass [last week](https://github.com/sass/libsass/releases/tag/3.2.0).

Some of this credit has got to go to Nick Fitzgerald and the excellent work Mozilla has done on the [source-map](https://web.archive.org/web/20150404150551/https://www.npmjs.com/package/source-map) library, which provides the bulk of the code folks need to enable source maps without having to dive deep into the spec. It works great, has a simple and flexible API, and [over 200 npm modules](https://www.npmjs.com/browse/depended/source-map) depend on it.

# It works for The Terminator

The source-map library works so well, I took it and implemented [a new language that compiles to JavaScript](https://github.com/mattdsteele/arnoldc.js), with full source map support.
Granted, the language is [ArnoldC](https://github.com/lhartikk/ArnoldC) and quite possibly the dumbest project ever conceived, but it works, damnit!
And I never once had to open the [Source Maps specification](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit) to learn its mysterious secrets.

(ArnoldC should probably be detailed in its own post, this has gotten _way_ too long.)

So if you've been waiting to investigate Source Maps, now might be a great time to start. You have nothing to lose but your one-character named minified functions.

[nejs]: http://www.nebraskajs.com
