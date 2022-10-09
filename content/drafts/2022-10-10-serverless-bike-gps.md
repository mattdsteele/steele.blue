---
layout: post
title: Serverless Bike Tracking with a SPOT Tracker, AWS Location + Friends
---

I recently participated in the Gravel Worlds [Long Voyage](https://www.gravel-worlds.com/the-long-voyage) bike race. Last year I [tried, and failed](/gravel-worlds), to finish the 300 mile course, and [built a pacing calculator along the way](/js-temporal).

This year, I felt better prepared, rode smarter, and actually finished! My intent was to simply complete the race within the time limit, with a stretch goal of finishing before sundown. I ended up making it with about an hour of sunlight to go, and I couldn't be happier.

I credit some of my success this year to spending more time riding through the year, both on longer gravel base rides, and structured intervals on the trainer. But I still had enough time to build another dubiously useful website!

That's what I want to share today; a site that captures data from a GPS tracker, and makes it available for folks to track my progress. There are a number of public versions of this (they call it [dot watching](https://www.cyclist.co.uk/in-depth/10221/what-is-dotwatching)), but I wanted to add some fancier features, such as creating geofences at expected stops.

I built out the site using AWS serverless architecture (Location Services, Lambda, and others).
The code is available at https://github.com/mattdsteele/spot-tracker-tracker, and you can see the page for my ride [here](https://2022-gw--reliable-liger-e88e30.netlify.app/)

## Capturing GPS Pings

I used a [SPOT Messenger][spot] device; which all racers were required to carry with them. 
SPOT devices are neat; they were designed with fairly easy-to-use APIs, along with a set of prebuilt maps you can share with friends.

There are other similar devices available, such as Garmin's InReach.

I wanted to try and build a site that was low-maintenance, and didn't require running any persistent servers.

[spot]: https://en.wikipedia.org/wiki/SPOT_Satellite_Messenger