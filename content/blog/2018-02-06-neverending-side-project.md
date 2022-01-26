---
layout: post
title: The Neverending Side Project
---

I love side projects. I keep track of what I'd like to work on in a [GitHub repo](https://github.com/mattdsteele/side-projects/issues/).

Most side projects don't need much oversight. That's kind of the idea: you spend a few hours building something fun, blog about it, and move onto something else.

But I think there's space for another kind of project: one that spans years. The formula's simple:

- Build a site/app/whatever
- Let it sit on a shelf for a year
- Dust off the cobwebs and make some enhancement, switch frameworks, whatever
- Repeat

### The Codebase of Theseus

One project I've been building is a statistics app for [Super Bowl Squares](https://web.archive.org/web/20180206183833/http://www.superbowlsquares.org:80/how-to-play), a mostly-random gambling endeavor. It's a dumb game, worthy of a dumb side project. You can [view the latest version here](https://web.archive.org/web/20210515101151/https://projects.steele.blue/squares/ng5/).

![squares](https://images.performgroup.com/di/library/sporting_news/8/e4/super-bowl-squares-012815-ftrjpg_192r85vn9rmv61fzavaolc2i8s.jpg?t=846249227&w=960&quality=70)

I built my first version of the app back in 2011 as a fresh-faced front-end dev, with nothing but spaghetti jQuery.

Over the years, I've migrated and rebuilt the app numerous times:

- Original jQuery version (2011)
- Added a build toolchain with Webpack and npm (2014)
- Rewrote using AngularJS 1.x (2015)
- Migrated to Angular 2 beta (2016)
- Rebuilt with TypeScript and the Angular CLI (2018)

### Inheriting Your Legacy

A long-lived side project gives you the chance to confront your old habits and see how far you've progressed. I started with jQuery because that's all I knew. I can still see parts of me in the old codebase, but I also see how my coding style has evolved.

A long-lived side project also gives you breathing room to ask how much stock to put into trends. [My original jQuery app][jq] still loads faster, has 60% less code, and (to my mind) is more understandable than [my latest version built atop Angular 5][ng5]. Have I actually made things better? Have we as an industry?

I didn't get to all the updates I wanted to make to the app this year; I wanted to add some Redux-style state management with ngrx. But it's okay, I know what I'll be working on next year.

[jq]: https://github.com/mattdsteele/football-squares/blob/jquery/js/squares.js
[ng5]: https://github.com/mattdsteele/football-squares/tree/master/src
