---
layout: post
title: Light Up Your Bike with Web Bluetooth and StencilJS
---

{% picture bdl-bt-1.jpg alt="Bike DeLights testing" %}

Every year the Omaha cycling community puts on the Bike De'Lights ride: an opportunity to illuminates your bike and tour the city's Christmas lights. And every year I try to find a new way to drive a five meter RGB light strip.

This year I've been most excited about Web Bluetooth, and Web Components. Each technology has the opportunity to open previously closed ecosystems, and make them broadly accessible, and I wanted to use them to build a lighting system that anyone could control with their phone; no apps required.

## Hardware

* [RGB 12V LED Light Strip](https://www.amazon.com/gp/product/B00DTOAWZ2/ref=oh_aui_search_detailpage?ie=UTF8&psc=1)
* [Bluetooth LED controller](https://www.amazon.com/gp/product/B00ZQVWU2O/ref=oh_aui_search_detailpage?ie=UTF8&psc=1)
* [12V of AA batteries](https://www.amazon.com/SMAKN%C2%AE-8PCS-Battery-Holder-Black/dp/B01F6LHMR6/ref=sr_1_4?ie=UTF8&qid=1513571511&sr=8-4&keywords=12v+aa+battery+holder)

The controller and batteries fit in the bike's saddlebag, and the light strip had sticky tape that stuck to the frame. It's a pretty simple setup.

## Reverse Engineering the Bluetooth Controller

The Bluetooth LED controller was intended to be controlled via a native Android app, but it's garbage. But since it's a Bluetooth Low Energy device, [it's hackable](/web-bluetooth/)!

To reverse engineer the controller, I ended up using the strategy described [in Uri's post](https://medium.com/@urish/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546): recording interacting with the app and playing it back on my laptop using Wireshark.

I found one Bluetooth service/characteristic you could send two types of commands via `Uint8Array`s: an arbitrary RGB color, or a preset color scheme (mostly fades).

The code to control the device is available [here](https://github.com/mattdsteele/web-bluetooth-bike-leds/blob/master/src/components/bluetooth-strip/bluetooth-strip.tsx#L16).

## Building with Web Components and StencilJS

Web Bluetooth only works on Chrome devices, so building the controller app using Web Components was an easy decision and used no polyfills.

I've been pretty enamored with [StencilJS](https://stenciljs.com/) lately, and built the app with a handful of web components. Even the code to control the Bluetooth device is a `<bluetooth-strip>` [web component](https://github.com/mattdsteele/web-bluetooth-bike-leds/blob/master/src/components/bluetooth-strip/bluetooth-strip.tsx)!

Stencil made it really simple to build a fast site, and fast. Since it's all TypeScript-based, I could create a mock component that implemented the same `interface` as the `<bluetooth-strip>` component, and test the app without having to continuously connect to a real device.

## Broadcasting the URL via the Physical Web

Once I built the site, I deployed to a static host, but my goal was to let other riders control my lights using their phone. And it's a huge bummer to have them open Chrome and type in a giant URL.

This is where the [Physical Web](https://google.github.io/physical-web/) comes in - a device can broadcast a URL, and nearby devices can be notified and interact with it.

I installed Node on a [Next Thing CHIP](https://docs.getchip.com/chip.html), and used the [eddystone-beacon](https://www.npmjs.com/package/eddystone-beacon) module to broadcast my StencilJS URL.

Fun fact: the USB battery was way larger than the computer it was powering!

Code is available [here](https://github.com/mattdsteele/web-bluetooth-bike-leds/tree/master/broadcast).

## Results

{% picture bdl-bt-2.jpg alt="I'm behind the cooler setup" %}

Overall the project went really well! Unlike previous lighting systems, no soldering was required, and I didn't run into any technical glitches during the ride. These two are likely related.

One issue I noticed was that folks don't understand how the Physical Web stuff works.
I told a few cyclists about my setup, but had to work with them to pull out their phones, and show where the link appeared in their Notifications dropdown.

My primary goal with the project was to let others control the lights, and I succeeded with that.
My secondary goal was to have a random cyclist connect and control my lights. That didn't happen, and I think the issues there are intrinsic to the design of the Physical Web.

You can play with the site [here](https://projects.steele.blue/bike-lights/).

See previous lighting projects [here](/raspberry-pi-bike/) and [here](/arduino-bike-lights/).
