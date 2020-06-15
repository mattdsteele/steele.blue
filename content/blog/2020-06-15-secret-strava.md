---
layout: post
categories:
  - side-project
title: Secret Strava
---

I built a thing that I'm not sure anyone else will find useful, but it was fun and I learned a few things.

## Strava needs better privacy controls

As a social network for athletes, [Strava's](https://strava.com) pretty good. It might be the only good one around these days!
But their privacy controls are lacking. You can set each activity to be visible to everyone, only your followers, or just yourself, but it's a manual tag, which can be especially cumbersome if your activities are auto-uploaded from your GPS device.

Ideally you'd be able to set some heuristics on your activities, such that "commutes" stay private, but races and long weekend rides are more visible. This isn't possible out of the box, but you can cobble something together with [their API](https://developers.strava.com/).

So that's what [Secret Strava](https://github.com/mattdsteele/secret-strava) does: **every time you upload an activity, it checks against a set of rules on whether it should be made public**, such as the distance ridden, if it's tagged as a commute, etc. This is done using a combination of a webhook subscription, their REST API, and some screen-scraping glue.

## Building the app

One of the top Strava client libraries is @dblock's [strava-ruby-client](https://github.com/dblock/strava-ruby-client), so I built an Ruby app so I could use it.

The app itself runs as a few Sinatra endpoints, running on GCP as a Cloud Run app, with OAuth tokens stored in a Fauna database.

### A few things I enjoyed about this stack

**Cloud Run for serverless containers** - I don't like maintaining servers for side projects, but Ruby isn't natively supported with Lambda, Cloud Functions, or any of the other major serverless providers.

So I was happy to hear about [Knative](https://knative.dev/), and Google's Cloud Run implementation, which provides similar managed, autoscaling, scales-to-zero-instances to any Docker container.

It was pretty neat to take my running app from my workstation, and push to GCP just by creating a Dockerfile, without having to make any other app changes.

**Database as a service** - This has gotten a lot easier since I last had to persist anything. Fauna's model lets you create a store and query it just by defining a GraphQL schema. Even compared to other managed databases this is pretty straightforward.

**CI/CD with GitHub Actions** - These are still great. I'm not sure I'll go back to anything else for OSS projects.

### Stuff I had trouble with

**GraphQL queries on the server** - Maybe this is better in other server-side languages, but this part was rough. Even using GitHub's [graphql-client](https://github.com/github/graphql-client), I missed out on most of the things I get from Apollo+TypeScript, such as development-time syntax verification. Compared to other ORM approaches it felt very messy.

**Ruby** - It's been almost 10 years since I wrote any Ruby, so I'm definitely a little rusty, but everything felt sloppy compared to the TypeScript/Java/Go I'm used to coding in.

Without any basic editor assistance like method autocomplete, auto-imports, or syntax errors, I had to rely much more on unit tests (which luckily are still great in Ruby!) and manual scripts.

But Ruby's reliance on building DSLs, and monkey-patching existing classes consistently kept me guessing.

**Strava's API, and social APIs generally** - As I started to build this out, Strava made some pretty significant changes to their API, with the intention of [converting more users into subscribers](https://www.dcrainmaker.com/2020/05/strava-cuts-off-leaderboard-for-free-users-reduces-3rd-party-apps-for-all-and-more.html).

Even prior to these recent change, they've been reducing the power of their APIs, such as [removing the ability to change an activity's privacy](https://groups.google.com/d/topic/strava-api/L_zZNdgV24c/discussion), so I had to resort to screen-scraping.

I have very little faith that Strava has third-party developers in mind when building their platform, but this appears to be the bargain we've struck for acess to any data from within the walled gardens of a social network.

Tom Scott has a good overview of the tradeoffs we've decided as an industry to make (and RIP to the legendary Yahoo Pipes):

`youtube: BxV14h0kFs0`

## Heroku was ahead of its time

I really liked building and deploying to GCP using Cloud Run. The abstraction for general-purpose HTTP servers feels right, and the auto-scaling means the price is right.

But at the end of the day, I'm not sure it's any more advanced than Heroku's original PaaS product from like, 10 years ago. It's crazy how advanced Heroku was compared to the other toolchains at the time.

Has the last decade of Cloud Native tooling really just been a process of standardizing the offering across other languages, and making the PaaS tooling work with Docker/Kubernetes?

I'd love to know more about what other PaaS offerings are like. From my perspective, Cloud Foundry/Heroku/OpenShift/Knative are all pretty interchangeable. If there's more nuance here, let me know!
