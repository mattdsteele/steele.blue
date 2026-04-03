---
layout: post
title: My house alerts me when my cat climbs into the ceiling
---

We have an orange cat who loves to climb into our basement's drop ceiling and wander around.
It's especially adorable when she hangs out in an alcove and surveys her domain.

![An orange cat standing proudly in a crawlspace of a drop ceiling](/content/images/cat-light/cat-in-ceiling.jpeg)

This does not happen on any predictable schedule, as per the whims of a cat. But I didn't want to miss out on any chances to see her perched up there.

So, I wired some cheap IoT devices together to notify us when she hops into the ceiling.

<video controls muted="true">
  <source src='/videos/cat-light-sidebyside.mp4' type="video/mp4" />
</video>

## The workflow

The goal of the project was to turn on a light in the living room any time a cat is detected in the drop ceiling alcove.

To do this, I used a few Internet of Things devices I had on-hand:

* A cheap Wi-Fi "security" camera (Wyze)
* An even cheaper Wi-Fi RGB light (Merkury)

Out of the box these devices don't talk to each other, and are no longer supported by their manufacturers.
And I wouldn't want to rely on various cloud vendors for a mission-critical workload like this, so this was a perfect job for [Home Assistant](https://www.home-assistant.io/).

I've used Home Assistant in the past for [similarly dubious projects](/esp8266-chevy-bolt-fob-homeassistant), so I had some familiarity with its capabilities. It's got fairly extensive automation capabilities, where a change in one device's state can trigger a workflow to modify other devices, so this seemed very much in its wheelhouse.

## The devices

Integrating the light wasn't too much of a challenge, though it took some sleuthing to discover that the device used Tuya firmware, which had a straightforward integration.
I was hoping to be able to modify it to not require connections to Tuya's cloud servers via a tool like [tuya-cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter/), but this wasn't available as a predefined, easily hackable device, so it became a project for a later date.

Adding camera feeds was done by integrating the open-source [Frigate NVR](https://frigate.video/). As per [Frigate's docs](https://docs.frigate.video/configuration/object_detectors/) I set it up for object detection, for both people and cats:

```yml
ffmpeg:
  hwaccel_args: preset-vaapi

objects:
  track:
    - person
    - cat

detectors:
  ov_0:
    type: openvino
    device: GPU

cameras:
  wyze_ceiling:
    enabled: true
    ffmpeg:
      inputs:
        - path: rtsp://id:password@192.168.200.4/live
          roles:
            - detect
    detect:
      enabled: true
      width: 1280
      height: 720
```

![A screenshot of Frigate, showing a matrix of cats from object detection](/content/images/cat-light/frigate-matrix.png)

Frigate has a [Home Assistant plugin](https://docs.frigate.video/integrations/home-assistant/) that works quite well, connecting to the same MQTT broker I was already running for other IoT devices.

Hooking this into Home Assistant gave me an few data streams I can key off, like any other sensor.

![A screenshot of a Home Assistant history panel, showing times a cat has occupied the frame of the ceiling](/content/images/cat-light/frigate-history.png)

## Integration

Using the automation tools built into Home Assistant, I can toggle the light pretty easily:

![Home assistant workflow UI](/content/images/cat-light/hass-workflow.png)

Or in code:

```yaml
alias: Cat Presence
description: ""
triggers:
  - type: occupied
    device_id: b86f8493d0516cb5f9afe35ad61effcf
    entity_id: 5a7f5d90cdaaf72fff39387fe4e377ab
    domain: binary_sensor
    trigger: device
conditions: []
actions:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.merkury_bw901_bulb
    data:
      brightness_pct: 100
mode: single
```

Overall the project went really well, and I'm still delighted when the orange light turns on while I'm hanging out in the living room.
There are a few things I'd like to improve with the workflow, but it's primarily around my hosting and object detection (I'd like to move Frigate to a Raspberry Pi with an AI hat, so I can add more cameras and detect cats elsewhere)

As dumb as a project like this is, it still lends credence that integration of disparate devices can bring value greater than the sum of their parts. No one is going to offer a commercial "ecosystem" that would give me these capabilities, especially not with cheap consumer hardware that's been abandoned by the manufacturers.

![An orange light shining in my living room](/content/images/cat-light/light-enabled.jpeg)