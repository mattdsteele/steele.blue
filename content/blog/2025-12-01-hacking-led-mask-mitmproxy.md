---
layout: post
title: Hacking custom GIFs onto an LED Mask with mitmproxy
---

`youtube:https://www.youtube.com/watch?v=D9mcNBhYvoA`

This Halloween I went as Rorschach, the Watchmen 'hero'.
I don't have much of a connection to the character; it was mostly an excuse to play with an LCD face mask I bought a few weeks earlier.

![animated gif of rorschach inkblots](/content/images/rorschach-mask.gif)

Since I was on a time crunch to implement the face mask in time for a Halloween party I was attending, I decided to go for the simplest approach:
use the official Android app to upload my custom GIF onto the mask.

Fortunately, through my day job I've been introduced to a number of tools that help provide the shims necessary to make this happen, including:

* [mitmproxy](https://www.mitmproxy.org/) to capture and inspect Bluetooth packets
* [apktool](https://apktool.org/) to decompile the "official" Android app to hunt for interesting strings
* [LightBlue](https://punchthrough.com/lightblue/) to test sending Bluetooth commands to a device
* [Wireshark](https://www.wireshark.org/) to evaluate sending Bluetooth packets

The actual code I had to write ended up being an extremely small [mitmproxy add-on]():

```python
def response(flow):
    if flow.request.url.endswith('.gif'):
        # Brute force. Replace all .gif images the app downloads with my GIF
        img = open('rorschach-mask.gif', 'rb').read()
        flow.response.content = img
```

It was a fun exercise to get an animated GIF onto a device that clearly didn't want to be hacked like this!

![still image of me in my rorschach costume](/content/images/rorschach-mask.jpg)