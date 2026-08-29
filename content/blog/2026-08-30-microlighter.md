---
layout: post
title: MicroLighter is Living Span-Free In My &lt;head&gt;
---

I'm really excited for [MicroLighter](https://davatron5000.github.io/microlighter/) - the new syntax highlighter from Dave Rupert. I've switched over this blog to use it.

I've used a number of syntax highlighters over the years, Pygments, Rogue, Prism, Shiki.
All worked in essentially the same way: parse a block of code into tokens, wrap each token in a `<span>`, and style with CSS.

This worked, but it always felt like a kludge. But with [CSS Custom Highlights](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API) now generally available in browsers, highlighting can be done directly on a block of text without resorting to DOM manipulation.

Inspect this block: it's just a standard `<pre><code>` element:

```go
package main

import "fmt"

func main() {
    fmt.Println("hello world")
}
```

## It's not build-time, but that's ok

My previous syntax-highlighting approach converted a Markdown code block into the relevant span tags at build-time. I generally like this JAMstack approach - it avoid runtime JavaScript, and can be deployed anywhere.

Since the CSS Highlight API uses JavaScript to create the ranges, it needs to run in the browser. So there's another script tag to pull in, and you'll only get syntax highlighting in compatible browsers.

I think that's an acceptable tradeoff. It very much falls in line with progressive enhancement - if the script fails to load, or you use an older browser, you'll just get vanilla, unhighlighted text. [Rob Pike would approve](https://groups.google.com/g/golang-nuts/c/hJHCAaiL0so/m/kG3BHV6QFfIJ).

## Make it an Eleventy plugin

MicroLighter is already flexible enough to be loaded in a number of ways - from a CDN, or programmatically via a `highlightAll()` method, or as a Web Component. But you still have to load the script one way or another.

My blog runs Eleventy, so I built a plugin that loads in MicroLighter automatically on any page with a code block, and *only* on those pages. Fairly straightforward [transform](https://www.11ty.dev/docs/transforms/), though copying over the required assets took a bit of Node/filesystem manipulation.

The code isn't super robust so I'm not planning to publish it as a standalone module, but it's [available on GitHub](https://github.com/mattdsteele/steele.blue/blob/main/src/plugins/11ty-plugin-microlighter.js) if you want use it yourself.
