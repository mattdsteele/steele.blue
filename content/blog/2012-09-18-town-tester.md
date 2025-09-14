---
layout: post
title: Town Tester - How well does your city unit test?
categories:
  - Code
tags: []
status: publish
type: post
published: true
meta:
  _wpas_mess: Town Tester - How well does your hometown test?
  _wpas_skip_twitter: '1'
  _elasticsearch_indexed_on: '2012-09-18 16:20:19'
---

In my talk <a href="https://vimeo.com/49092644/">Zen and the Art of TDD</a>, I included a slide that showed only 43% of all Github repositories from Omaha developers included unit tests:

![Languages](/content/images/languages1.png)

Today I'm releasing the code I used to obtain this data: a script called Town Tester.

<strong><a href="https://github.com/mattdsteele/town-tester">View town-tester on Github</a></strong>

It's a Ruby script that queries the Github API to do the following tasks:

<ul>
	<li>Find users with their Location set to the value you provide</li>
	<li>Clones all "popular" repos (not a dotfiles project, at least 1 watcher, not a fork)</li>
	<li>Checks for the existence of tests (based on a filename that includes "test" or "spec")</li>
	<li>Creates a .csv with data on each repo, and prints statistics broken down by language</li>
</ul>
I'm excited for the possibilities of this project:
<ul>
	<li>Want to showcase how awesome your local community is? Steal developers away from San Francisco by proving your city can test better than their piddling 56% rate.</li>
	<li>Put an end to the Great Semicolon Debates. Whichever developer has more JavaScript repositories with tests wins all syntax arguments by default!</li>
	<li>Gamification is all the rage. Why not track your city's testing ratio over time, and give XP to developers that increase the ratio the most? Each month, the winner could get free drinks at your local <a href="http://www.beerandcode.org/">Beer &amp;&amp; Code</a>.</li>
	<li>Just in time for the <a href="http://globalday.coderetreat.org/">Global Day of Coderetreat</a>, you could lure <a href="https://twitter.com/coreyhaines">Corey Haines</a> to your hometown by being the best tested city in the world. I'm pretty sure he doesn't really want to go to Sydney or Honolulu anyway.</li>
</ul>
I know I'm just scratching the surface of this venture.

Also, please don't game the system by adding a "test.txt" file to the root of each of your repositories.
