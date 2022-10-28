---
layout: post
title: <bt-device> and Renderless Web Components
---

I keep buying [dumb Bluetooth devices](/web-bluetooth) and hooking them up to websites, but there's just enough boilerplate to make integrating them a hassle.
So, I [made a little Custom Element](https://github.com/mattdsteele/bt-device/) to help automate some of the boilerplate.

You'd use `<bt-device>` like any other HTML element:

```html
<!-- Connects to a Thermos Smart Lid water bottle -->
<bt-device
  service="40fc0000-8a8d-4a32-a455-c1148e24a9f1"
  characteristic="40fc0001-8a8d-4a32-a455-c1148e24a9f1"
  notifications="true"
></bt-device>
```

And then grab the element and connect up to receive notifications:

```javascript
const device = document.querySelector('bt-device');
await device.connect();
device.addEventListener('data', evt => {
  console.log(evt.detail.data);
});
```

And that's basically it! Building this makes it easy to add more advanced, cross-cutting features like automatic reconnect, exponential backoff, and the like.

# Renderless Web Components

This is a Web Component, but doesn't use Shadow DOM, Stencil, or any library. In fact, it doesn't render anything to the DOM at all.
Rather, it's just distributed as a Custom Element to make for easy integration with just a script tag and some HTML; just like the good old days.

I'm not sure if this pattern has a formal name, but I've been calling them "renderless web components". I've seen a handful of these in the wild, such as Polymer's [iron-ajax](https://www.webcomponents.org/element/@polymer/iron-ajax) for making Ajax calls, or [app-pouchdb-query](https://www.webcomponents.org/element/PolymerElements/app-pouchdb/elements/app-pouchdb-query) to handle database queries.

I'm no React expert, but there are a few interesting renderless components out there, such as [powerplug](https://rena.to/react-powerplug/#/). Components that delegate to a render prop (such as [Downshift](https://web.archive.org/web/20200414125454/https://kentcdodds.com/blog/introducing-downshift-for-react/)) seem to be operate with a similar philosophy.

For web-facing libraries I quite like the idea of building them with HTML, rather than JavaScript, as the starting point.
For no other reason, It's pretty neat getting Bluetooth functionality in a browser without leaving the "HTML" tab in JSBin!
And it fits in nicely with declarative, component-based architecture; I've integrated this component into Angular and LitElement apps super easily.

I'm not sure all web utilities can be built this way, but it's something to consider when building your next library!
