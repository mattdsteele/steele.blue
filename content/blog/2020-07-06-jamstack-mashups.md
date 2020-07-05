---
layout: post
categories:
  - side-project
title: Maybe mashups in 2020 are just Jamstack sites
---

_*Millhouse voice*_ Remember mashups? They're back, in Jamstack form.

A decade ago the Big Idea in front-end development was the [mashup](https://en.wikipedia.org/wiki/Mashup_%28web_application_hybrid%29); taking disparate data sources and combining them via JavaScript trickery to create something novel. Want to pull down the current weather and compare it to the climates on Star Wars planets? [Hell yeah, dawg](https://www.slashfilm.com/star-wars-weather-compares-local-weather-conditions-to-star-wars-planets/).

Did you know there was a nonprofit consortium dedicated to enterprise mashup standards? [Open Mashup Alliance](https://en.wikipedia.org/wiki/Open_Mashup_Alliance), we need you now more than ever!

As time went on, data providers started to claw back and restrict access to their data. And it's a one-way wrench: the trajectory of most companies is to start with an open set of APIs, and then gradually restrict it to first-party apps, and only with OAuth token workflows that cannot be implemented safely in the browser.

As RSS feeds disappeared and unauthenticated REST endpoints vanished, it became impossible to technically implement the mashup of your dreams. But the dream never died, it just moved server-side.

I think that's why I'm excited by static site generators, and Jamstack in general. It's trivial to integrate multiple data sources with tools like Gatsby or Eleventy. And since it all runs server-side, you can integrate using whatever arcane restrictions, API keys, or other tomfoolery that services require you to go through to acccess the data that's legally yours.

Lately I've been playing with Strava's datasets, which are inaccessible in the browser. But by moving processing to the server, I was able to build out [Omaha Trail Status](https://trails.steele.blue/), which integrates segment ride information with GeoJSON maps, and heatmap histograms of ride data.

The whole thing is hosted on a CDN, populates a serverless database via a serverless functions, and is easily in the free tier of cloud services.

So get yourself back in the 2009 mindset: throw on a [Girl Talk](https://www.youtube.com/watch?v=vU62x2PnSO4) album and build the mashup of your dreams.
