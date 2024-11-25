---
layout: post
title: Diving into the Device API
categories:
  - Technology
tags: []
status: publish
type: post
published: true
meta:
  _publicize_pending: '1'
  tagazine-media: >-
    a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:7:"1801759";s:7:"blog_id";s:7:"1731277";s:9:"mod_stamp";s:19:"2013-06-19
    22:21:58";}
  _elasticsearch_indexed_on: '2013-06-19 21:46:31'
---

I recently read Tim Wright's <a href="http://alistapart.com/article/environmental-design-with-the-device-api">article on A List Apart</a> detailing the Device API; a collection of W3C standards that let you obtain access to a number of hardware sensors.

I found this fascinating, and had to try them out. <strong>Here's what I've learned</strong>.

Note: for most of these demos, you'll want to try them out in specific browsers (either Android Firefox or iOS Safari); as of today, browser support is limited. The most up-to-date information on browser implementation is on <a href="http://www.w3.org/2009/dap/wiki/ImplementationStatus">this page</a>.

All demo code is <a href="https://github.com/mattdsteele/device-apis">available on GitHub</a>.

<h2>Battery Status</h2>

`youtube:https://www.youtube.com/embed/dLD7Ve5t5cI`

<h3><a href="http://www.matthew-steele.com/projects/device-apis/battery.html">View Demo <em>(works in Android Firefox)</em></a></h3>
The <a href="https://dvcs.w3.org/hg/dap/raw-file/tip/battery/Overview.html#introduction">Battery Status API</a> is straightforward - it adds a new object <code>window.navigator.battery</code> that you can inspect and discover how much juice is left in the device for you to suck out (this is exposed by <code>battery.dischargingTime</code> and is measured in seconds).

<code>battery.charging</code> returns a boolean. You can inspect the charged level using <code>battery.level</code>, but the most interesting parts are the <a href="https://dvcs.w3.org/hg/dap/raw-file/tip/battery/Overview.html#event-handlers">events</a>, which let you capture when a device starts charging, or reaches a threshold over 60%, etc.

The demo captures the <code>chargingchange</code> event and changes some background colors. but you could do lots of things with this data. For example, it might be prudent to turn off 3D CSS transformations at a certain battery threshold, as they're quite power-hungry. <strong>By treating power as a feature test, you can take progressive enhancement to a new level</strong>.

<h3>Availability</h3>
Firefox currently supports this API on desktop and mobile Android. WebKit <a href="https://bugs.webkit.org/show_bug.cgi?id=62698">appears to have implemented</a> it briefly last year, but it's currently disabled and work to re-enable it <a href="https://bugs.webkit.org/show_bug.cgi?id=90538">appears to have stalled</a>. Similarly, <a href="https://code.google.com/p/chromium/issues/detail?id=122593">Chromium has a patch built</a> but it doesn't seem to have ever landed.
<h2>Ambient Light Sensor</h2>

`youtube:https://www.youtube.com/embed/YEkhmYXJAeY`

<h3><a href="http://www.matthew-steele.com/projects/device-apis/lightsensor.html">View Demo <em>(works in Android Firefox)</em></a></h3>
Most phones have an ambient light sensor - it's mostly used to dim the screen in low-light environments. The <a href="https://dvcs.w3.org/hg/dap/raw-file/tip/light/Overview.html">Ambient Light Sensor API</a> works with any sensors that can read light levels, including an embedded camera. There's lots of environment-specific modifications to a site you could perform with this.
<h3>Availability</h3>
Firefox on Android has it, and it's implemented on the desktop in OS X. There's a patch for Windows 7 that <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=754199">appears to have stalled</a>. I don't see any evidence that other browsers are planning to implement it.
<h2>Device Orientation</h2>

`youtube:https://www.youtube.com/embed/c7rWFcYSs1g`

A native app that recently captured my attention was the <a href="http://pizza-compass.com/">well-advertised Pizza Compass</a> for iOS. It does exactly what you'd expect. I wanted to try a version in pure HTML5. Right now it only points you to a pizza place in my city, but it meets my use case, so why abstract?

<h3><a href="http://www.matthew-steele.com/projects/device-apis/pizza.html">View Demo <em>(works in Mobile Safari/iOS Chrome)</em></a></h3>
There's a number of device location/orientation sensors in modern cell phones, and it's not always clear which HTML5 feature to use:
<ul>
	<li>Accelerometer/Device Tilt: <a href="http://dev.w3.org/geo/api/spec-source-orientation">DeviceOrientation</a></li>
	<li>Latitude/Longitude: <a href="http://dev.w3.org/geo/api/spec-source.html">Geolocation</a></li>
	<li>Compass: <a href="http://dev.w3.org/geo/api/spec-source-orientation">DeviceOrientation</a> (using the alpha property)</li>
</ul>
There's been plenty of apps that use Latitude/Longitude; many use it to assist in a "Store Locator" feature. Google's also done a few <a href="http://chrome.com/campaigns/rollit">interesting experiments</a> with DeviceOrientation, but I haven't seen many instances of its use in the wild.
<h3>Here Be Dragons</h3>
The basic functionality works on current iOS browsers. However, I ran into a number of quirks on other platforms that also support the DeviceOrientation API; which means you can't build interoperable apps with it.
<ul>
	<li>Firefox <strong>increases</strong> the alpha property as the device rotates clockwise. All other tested devices <strong>decrease</strong> the property when rotating clockwise.</li>
	<li>The alpha property's initial value is all over the place. Some browsers (iOS Mobile Safari) set it at 0 based on the initial orientation of the device. Other browsers set 0 to a particular orientation, but it's inconsistent (Android Browser is 0 at west, Firefox is 0 at north, Chrome is ambiguous).</li>
	<li>The event provides an absolute property, assuming the alpha value is calibrated to formal <a href="http://dev.w3.org/geo/api/spec-source-orientation#deviceorientation">Euler Angles</a> (Firefox and Chrome for Android implement this). There doesn't seem to be consistency even with this.</li>
</ul>
<h3>Availability</h3>
Most mobile browsers support these APIs, with the caveats stated above.
<h2>Conclusion</h2>
These features are really slick, but they're hampered by the same issues that hinder the web platform generally: <strong>platform fragmentation and buggy implementations</strong>. But take the long view, and soon enough you'll be able to build real-world sites that capture environment input in lots of cool ways.
