---
layout: post
title: Toolchainless
---

I have a complicated relationship with build tools. I like [TypeScript](/typescript-for-javaers), Gulp, and the like. I think that [compilers are the new frameworks](https://tomdale.net/2017/09/compilers-are-the-new-frameworks/).
Heck, even this static site is built with Gatsby; an overcomplicated toolchain to generate HTML files if there ever was one.

But build tools are a [Roach Motel](https://hannahatkin.com/roach-motel/) in your stack: once you add them in, you're unlikely to ever abandon 'em. And it's never been easier to start a project with a ludicrously complicated toolchain. You're just one `npx create-react-app` away from a running project, powered by 1023 dependencies in node_modules. [Easy, but not simple](https://www.infoq.com/presentations/Simple-Made-Easy).

That's the bargain we've made to improve our ergonomics. React and Vue and Angular are so incredible that we use them in spite of their toolchains, not because of them.
But I'm excited about new methodologies that are breaking that link, and letting us **develop without tools** for the first time since the good ol' jQuery days.

## You might not need build tools

Some tools have gone away because browsers got better. With features like CSS Custom Properties, [you might not need Sass](https://hospodarets.com/you-might-not-need-a-css-preprocessor/#/) anymore.
And you can decompose your app into ES Modules and load as needed using import/export statements; no Webpack or Rollup required.

Some build tools went away because your editor got smarter. I love TypeScript, but Visual Studio Code's inference works pretty damn well for JavaScript as well; providing [autocomplete and lots of other goodies](https://code.visualstudio.com/Docs/languages/javascript).

Some build tools can be removed because CDNs are making a comeback. [unpkg](https://unpkg.com/) delivers up all of NPM via a simple URL, so you don't have to pull in Webpack just to load a dependency.

And new libraries are taking advantage of the toolchainless approach. Take [htm](https://github.com/developit/htm) - an in-browser project that uses ES6 tagged template literals to generate Hyperscript in the browser.
You can drop it into a Preact app and remove the JSX transpilation step:

```js
render({ page }) {
  return html`
    <div class="app">
      <${Header} name="ToDo's (${page})" />
      <button onClick=${() => this.addTodo()}>Add Todo</button>
      <${Footer}>footer content here<//>
    </div>
  `;
```

In fact, you can get a full Preact + htm project up and running with a single import statement:

```js
import {
  html,
  Component,
  render,
} from 'https://unpkg.com/htm/preact/standalone.mjs';
```

Drop that into a script tag in your `index.html` file and you've got a working Preact app that can run anywhere.

## Pizza Compass

I recently rebuilt an old project, [Pizza Compass](https://pizza.steele.blue/), a PWA that points you to the closest pizza. [The app I cloned](https://web.archive.org/web/20190321204022/http://pizza-compass.com/) claims to be the most important app ever made, which I can't deny.

[The first version](https://github.com/mattdsteele/device-apis/blob/master/js/pizza.js) of Pizza Compass was built in 2013 using jQuery, before toolchains took over. When I decided to rebuild it using modern UI components, I went with a toolchainless approach.

Built with the Preact + htm stack above, the codebase is modern and clean. And it felt _great_. I can still build with components:

```js
const PizzaCompass = ({ loc, heading, currentLoc }) => {
  const b = bearing(currentLoc, loc);
  const headingDelta = 180 - (heading - b);
  const distance = Math.floor(distanceFrom(currentLoc, loc) * 10) / 10;
  return html`
    <div class="app">
      <header><h1>${loc.name}</h1></header>
      <${Pizza} rotation=${headingDelta} />
      <footer><h1>${distance} km</h1></footer>
    </div>
  `;
};
```

But I'm not beholden to any toolchain. Builds are instantaneous because there's nothing to build. The project doesn't even contain a `package.json` file. Hell, I can run the whole thing using Python's SimpleHTTPServer.

The whole thing is 150-ish lines of Preact code, and when I'm done I can push to GitHub and have Netlify deploy the folder directly. It takes less than a second.

## How far does this scale?

I don't know. Eventually you'll probably reach a point where you want to add in tooling for asset optimization, or smarter bundling, or supporting IE11.

But for a weekend project like this, it worked great. And if it ever gets big enough, I can check in the tooling Roach Motel then.

I like this approach because it aligns with the [Principle of Least Power](https://web.archive.org/web/20190216032625/http://www.w3.org:80/DesignIssues/Principles.html). Not every project needs to have 1023 dependencies in their `node_modules`. And the more you default to using an opaque toolchain for everything, the more likely you'll get [bit with opaque errors](https://daverupert.com/2019/01/angular-autoprefixer-ie11-and-css-grid-walk-into-a-bar/).

Toolchains are a chainsaw. And these days, you don't have to use a chainsaw for everything.
