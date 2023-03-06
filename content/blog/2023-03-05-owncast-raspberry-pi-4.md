---
title: Running Owncast with Hardware Acceleration on a Raspberry Pi 4
---

Owncast is a self-hosted platform for streaming video, which I've been using for sharing all kinds of events, from [Zwift racing](/zwift-greenscreen) to [my wedding](/indieweb-wedding-livestream).
It's been really pleasant to use as a Twitch alternative.

Historically, I've run my instance (https://stream.steele.blue) on a virtual server in The Cloud (specifically, a $6/month DigitalOcean instance), but wanted to explore moving it on-prem, using my own hardware.
I had a few goals in mind:

* _Performance_ - Owncast uses ffmpeg under the hood to encode videos. If you have access to 'native' hardware you can enable hardware acceleration to improve performance by offloading rendering to a GPU. This isn't just a theoretical gain; on the VPS I can only encode a single medium-quality stream before I peg the CPU.
* _Utility_ - I had a Raspberry Pi lying in storage after finishing up [an earlier project](/photo-booth), which feels like an incredible waste of resources. Imagine an entire Linux computer, just sitting in a drawer!
* _Cost_ - Six bucks a month for a VPS isn't exorbitant, but it adds up. Within a year, I could buy a brand new Raspberry Pi (even at their inflated current prices)!

The Owncast docs includes a nice reference on [configuring a Raspberry Pi](https://owncast.online/docs/codecs/#raspberry-pi) with hardware encoding.


I used a Raspberry Pi 4 Model B with 2GB of RAM, and a 32GB MicroSD card I had leftover from previous projects.

It's connected to my home network via Wi-Fi; which is also where the source RTMP stream is at.

# tl;dr

**Here's what currently works**, as of March 2023:

## Software

You'll need to [run an old version of Raspbian OS](https://downloads.raspberrypi.org/raspios_full_armhf/images/raspios_full_armhf-2021-05-28/2021-05-07-raspios-buster-armhf-full.zip).
This is a 32-bit OS, even though the Pi 4 has a 64-bit CPU. More on that later.

You also need to run an old version of Owncast: [version 0.0.11](https://github.com/owncast/owncast/releases/tag/v0.0.11) or earlier. Download the [arm7 release](https://github.com/owncast/owncast/releases/download/v0.0.11/owncast-0.0.11-linux-arm7.zip) (or compile from source).

You'll also need a copy of ffmpeg which supports the [OpenMAX](https://en.wikipedia.org/wiki/OpenMAX) (omx) codec. The version available from the package manager will be sufficient: `sudo apt install ffmpeg`.

The remainder of the setup from the [Owncast quickstart](https://owncast.online/quickstart/configure/) is sufficient. For example, I enabled HTTPS by running an instance of [Caddy](https://caddyserver.com/) on the Pi.

## Configuration

Set up Owncast like the quickstart tells you. In the Admin console, under "Advanced Settings", change the Video Codec to "OpenMax (omx) for Raspberry Pi".

My video configuration has two stream outputs defined:

* 1200kbps, Low hardware usage, 24fps (Low quality)
* 4100kbps, Medium hardware usage, 60fps (High quality)

Feel free to experiment with [other configurations](https://owncast.online/docs/video/), but this worked for me.

I still serve the videos from S3 storage, which I had hosted in AWS, but [any of the S3 options should suffice](https://owncast.online/docs/storage/). S3 is cheap and easily scalable, so there wasn't a need to pull that on-prem

# What went wrong

As described above, I had to use an older, 32-bit version of Raspberry Pi OS, as well as an older version of Owncast, and won't be able to upgrade either of them as new releases come out.
That sucks! Here's the issues I ran into when trying to use current versions. Again, this is as current as of March 2023; I'm hoping to try again in a few months.

## Newer Raspberry Pi OSs don't have turnkey hardware encoding

Support for OMX on newer Raspberry Pi OS versions has gotten worse. Previously it wasn't supported on 64-bit Pi OS, but now it's gone from bullseye distros even on 32bit: https://github.com/raspberrypi/firmware/issues/1366#issuecomment-1034726587

So I took a look at enabling the new option for hardware encoding (Video4Linux). After hours of investigation, I wasn't able to find a version of ffmpeg that would let me successfully encode/decode videos with V4L hardware acceleration.
The full gory details are [in Issue #1379](https://github.com/owncast/owncast/issues/1379#issuecomment-1445502469).

## Newer Owncast versions don't work on 32-bit ARM

Owncast has gotten a number of enhancements since 0.0.11, including capturing metrics into  an embedded time-series database.
Unfortunately, their dependency has a bug that crashes when running on 32-bit ARM hardware, and doesn't appear to be well-maintained, so a patch isn't imminent. Details are [in Issue #2746](https://github.com/owncast/owncast/issues/2746)

# I'm still pretty happy with this setup

Even with the issues I ran into getting this all running, I like where it ended up. I got a better-performing instance running on cheaper hardware, at the cost of a few hours of experimentation. 
If I ever need to reconfigure things, it should be a 20-minute setup.

Ideally I'd have this running in a Docker container, but I didn't want to [run out of spoons](https://butyoudontlooksick.com/articles/written-by-christine/the-spoon-theory/) and was ready to declare victory and just use the software.

Over the last few months I've been reevaluating my use of cloud services, with a particular focus on virtual servers.
They occupy a "muddy middle" in terms of management responsibilities. Sure, Linode is going to spin up the instance, but I'm still responsible for installing my app, applying OS patches, isolating it within my tenant, etc. All the while, I'm [paying as much to rent the donkey as it would cost to buy it](https://world.hey.com/dhh/five-values-guiding-our-cloud-exit-638add47).

I wouldn't want to run a big distributed project on hardware I have at home, but then again, I wouldn't want to run any home project that requires a distributed setup.

But with the advent of simple Docker management tools like [Portainer](https://www.portainer.io/), I've been able to move a number of apps previously hosted on DigitalOcean or Linode out of the cloud, and onto machines running in my living room.
They've got enough resources that I can scale vertically for quite a while, or pick up another Raspberry Pi or two if I want more "single app appliances".
And with tools like [Watchtower](https://containrrr.dev/watchtower/) to help keep my containers up to date, and easier at-home network segmentation with [Unifi VLANs](https://help.ui.com/hc/en-us/articles/9761080275607), it's never been easier to get a simple, secure home server up and running.
