---
layout: post
title: Thank Java for Better JavaScript Dates
---

I gave a lightning talk at [NebraskaJS](https://nebraskajs.com) about the complex, decades-long relationship between JavaScript and Java's Date APIs:

`youtube:https://www.youtube.com/watch?v=AZ83qcYn_vE`

The first half was a bit of a troll; I used a Java REPL (anonymized to look like Node) to demonstrate some of the more famously unexpected behavior in the `Date` class:

```javascript
var date = new Date("March 20 2025");
date.getMonth(); // returns 2
date.getDay(); // returns 3
date.getYear(); // returns 125??
```

This code is syntactically correct Java and JavaScript, and **behaves identically in both languages**. 
One of the gifts of being told to ["make it like Java"](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/) when adding dates to a ten-day-old language.

Java, of course, got markedly improved Date/Time APIs in version 8. [Spearheaded](https://jcp.org/aboutJava/communityprocess/pfd/jsr310/JSR-310-guide.html) by the lead developer of the de facto third-party date/time library, the `java.time` APIs were a breath of fresh air, and the new standard tool for all time-related matters.

JavaScript has been following the same path, with Maggie Pint (one of the maintainers of Moment.js) working to standardize the Temporal API.
It's been a long journey, with it reaching Stage 3 of the TC39 process way back in 2021, but hasn't made its way to a browser engine just yet.

But it's *finally* [making its way into browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility)! Safari, Firefox, and Deno have it in preview release, with Chromium browsers in active development.

 So it's a great time to refamiliarize yourself with the API, start [checking out the polyfill](https://www.npmjs.com/package/@js-temporal/polyfill), and start building fun stuff, like [my gravel racing time estimator](/js-temporal/).