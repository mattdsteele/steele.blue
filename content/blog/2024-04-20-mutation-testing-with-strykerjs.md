---
layout: post
title: Mutation Testing with StrykerJS
---
[Jessica Codr](https://www.thecakecodes.online/) and I gave a talk at [NebraskaJS](https://nebraskajs.com/) about [StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/):

`youtube:https://www.youtube.com/watch?v=JPJbK5lT5IY`

As a means to gauge the quality of your tests, I'm not sure why so many folks gravitate towards using code coverage when [mutation testing](https://en.wikipedia.org/wiki/Mutation_testing) is a significantly better utility.

Make a change to your code, then run your tests. If everything passes, then your tests aren't catching bugs you could be introducing over time.

In some ways it's similar to fuzzing: by making large number of pseudo-random changes to a codebase, you can start to get a feel for which parts are solid, and which could use more attention.

I've had some experience with testing Java code with [PIT](https://pitest.org/), but am just starting to toy with Stryker for JS code.
