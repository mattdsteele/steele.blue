---
layout: post
title: Mutation Testing with StrykerJS
---
[Jessica Codr](https://www.thecakecodes.online/) and I gave a talk at [NebraskaJS](https://nebraskajs.com/) about [StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/):

`youtube:https://www.youtube.com/watch?v=JPJbK5lT5IY`

Stryker is a [mutation testing](https://en.wikipedia.org/wiki/Mutation_testing) tool - it makes a change to your code, then runs your tests. If everything passes, then your tests aren't catching bugs you could be introducing over time. Think of it as code coverage, with specific areas to focus on.

In some ways it's similar to fuzzing: by making large number of pseudo-random changes to a codebase, you can start to get a feel for which parts are solid, and which could use more attention.

As a means to gauge the quality of your tests, I'm not sure why so many folks terminate their assessment using code coverage when mutation testing is a more robust metric. There's some additional overhead (most frameworks don't incorporate mutation testing out of the box) and the test runs are slower, but you can let your CI job run it async (or setup a nightly job) and you'll get far more robust metrics.

I've had some experience with testing Java code with [PIT](https://pitest.org/), and Ruby has had [mutant](https://github.com/mbj/mutant) for a while, but Stryker was a new tool to me, even though it's been around for nearly a decade. I'm hoping it becomes a useful tool in the belt!
