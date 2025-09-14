---
layout: post
title: Keep Your Running Cadence With a Garmin Music Playlist
---

![The author running](/content/images/wabash-marathon.jpg)

I've been running more this year, and one of the aspects I've been working on is running at a consistently higher cadence.
Most experts recommend [running at a pace of 170-180 strides per minute][cadence], but it can be rough maintaining that over time!
And while some fitness devices have [metronomes](https://www8.garmin.com/manuals/webhelp/instinct/EN-US/GUID-7C3A8FE0-035D-43D2-8E5E-6B0FC75DD00C.html) that can help you keep pace, I've found that listening to music with a matching tempo.

Christopher McDougall recommends the [Rock Lobster approach](https://marathonhandbook.com/how-to-run-faster-farther-forever/) - at 180 beats per minute, it's a suggested cadence for many runners. But my wife hates that song, my cadence is a little lower, and I certainly can't listen to it for an entire running session!

There are plenty of [online playlists](https://open.spotify.com/playlist/37i9dQZF1DWZUTt0fNaCPB) that target a specific running cadence, but I don't want to subscribe to a service just to keep a tempo! I've got plenty of MP3s I've collected over the years, why can't I use those?

Ahead of a half-marathon I had signed up for, I wrote a script that does just that. Give it a folder of music files, and it'll find all of them within a tempo range, and create a playlist for you to drop onto a compatible device. I use a Garmin watch, but it should work for other devices as well.

The script to generate cadence playlists [is available here](https://gist.github.com/mattdsteele/082fd77c3e65faa1332a36962c11da78).

## Measuring Tempo

I tried a few approaches to grab BPM data for my files.
My first hope was to pull the data from an authoritative source such as [MusicBrainz](https://beta.musicbrainz.org/), but almost none of the songs in my library had a tagged tempo value.

I also tried [bpm-tools](https://www.pogo.org.uk/~mark/bpm-tools/), which is available on most Linux distributions.
This pulled back a cadence metric, but when spot-checking a few files, I noticed the data was pretty inaccurate; about 50% of the files deviated significantly from the calculated tempo.
This was made worse by the lack of a confidence metric, so I couldn't apply a low-pass filter to remove obvious errors.

I ended up using the [deeprhythm](https://bleu.green/deeprhythm/) library, which uses a convolutional neural network to detect tempo.
It performed really well, both to quickly detect thousands of songs, and also run accurately.
After spot-checking a few songs, I decided it was accurate enough for my usage, and wrote up a script to process my library.

```js
{"tempo": 91.0, "confidence": 0.65030837059021, "file": "/mnt/data/music/beets-library/Carly Rae Jepsen/E•MO•TION/12 - When I Needed You.mp3"}
{"tempo": 111.0, "confidence": 0.7165337204933167, "file": "/mnt/data/music/beets-library/Carly Rae Jepsen/E•MO•TION/06 - Boy Problems.mp3"}
{"tempo": 145.0, "confidence": 0.6137411594390869, "file": "/mnt/data/music/beets-library/Carly Rae Jepsen/E•MO•TION/15 - Favourite Colour.mp3"}
{"tempo": 112.0, "confidence": 0.9051607251167297, "file": "/mnt/data/music/beets-library/Carly Rae Jepsen/E•MO•TION/13 - Black Heart.mp3"}
{"tempo": 118.0, "confidence": 0.7597530484199524, "file": "/mnt/data/music/beets-library/Carly Rae Jepsen/E•MO•TION/01 - Run Away With Me.mp3"}
```

Garmin watches can load a playlist in M3U format, so the script builds a simple playlist, and consolidates everything into a folder you can drag & drop onto a device.

```text
0:/MUSIC/cadence/03 - Star Quality.m4a
0:/MUSIC/cadence/04 - Lucifer's Jigsaw.mp3
0:/MUSIC/cadence/03 - Brothaz.m4a
0:/MUSIC/cadence/02 - Such Great Heights.m4a
0:/MUSIC/cadence/11 - Paper Lanterns.mp3
0:/MUSIC/cadence/DSP - Le Weeknd de Nemo.mp3
0:/MUSIC/cadence/28 - The Room Where It Happens.m4a
```

## uv is neat

I've struggled running Python apps in the past, especially if they pulled in dependencies.
As chaotic as the JavaScript ecosystem is, using a library is (usually) as easy as an `npm install`.
With Python, I've never been able to make heads nor tails of pip, pipx, requirements.txt, poetry, virtualenv, and the other tools in the ecosystem.

A coworker pointed me toward Astral's [uv](https://docs.astral.sh/uv/), which claims to be the One Tool needed to manage the chaos.
And at least for this case, it works great!

I especially like its support for [inline dependencies (PEP 723)](https://packaging.python.org/en/latest/specifications/inline-script-metadata/#inline-script-metadata), which lets me specify all my project's dependencies with the script itself:

```python
#!/usr/bin/env python3

# /// script
# dependencies = [
#   "click"
#   "deeprhythm"
# ]
# ///

import click
from deeprhythm import DeepRhythmPredictor
import os
# ...
```
With this, I can simply `uv run <script>.py`, and it'll create a virtual environment, download required dependencies (or use a local cache), and execute the script.

[asciinema /static/casts/cadence.cast]

```bash
matt@ORTHO ~/mus> uv run bpm.py --dir /mnt/c/Users/Matt/Music/
⠹ Preparing packages... (38/53)
⠦ Preparing packages... (43/53)
nvidia-cuda-nvrtc-cu12   ------------------------------ 70.92 MiB/83.96 MiB
triton                   ------------------------------ 71.99 MiB/148.33 MiB
nvidia-cufft-cu12        ------------------------------ 71.36 MiB/184.17 MiB
nvidia-cusolver-cu12     ------------------------------ 71.01 MiB/255.11 MiB
nvidia-cusparselt-cu12   ------------------------------ 71.12 MiB/273.89 MiB
nvidia-cusparse-cu12     ------------------------------ 70.68 MiB/274.86 MiB
nvidia-nccl-cu12         ------------------------------ 70.77 MiB/307.43 MiB
nvidia-cublas-cu12       ------------------------------ 70.95 MiB/566.81 MiB
nvidia-cudnn-cu12        ------------------------------ 70.77 MiB/674.02 MiB
torch                    ------------------------------ 72.24 MiB/846.92 MiB                        
```

It does feel a little ridiculous pulling down PyTorch and a gigabyte of dependencies for a hundred-line shell script, but at least it's fast and easy!

uv also lets you execute scripts from a URL, so you can run this fom a command-line and begin processing:

```bash
uv run https://gist.githubusercontent.com/mattdsteele/082fd77c3e65faa1332a36962c11da78/raw/bbe07ad1fe8737153a49362cbe70f91d51a75fb8/cadence-playlist.py

```

## Maybe tempo isn't the only factor I should consider

I had a fun time with the playlist, and was able to keep a decent cadence going. You can even see where a song change with a significant delta occurred.

![A graph of running cadence over time. There are several blocks of consistent pace, correlating to ](/content/images/running-cadence.png)

With nothing but tempo to drive the playlist, I got a real eclectic mix in my ears. Some of the artists I experienced on the run:

* Rancid (ok!)
* Audioslave (nice)
* The Lonely Island (uh..)
* _Hamilton_ soundtrack (still slaps!)
* Jack Johnson (..I can't believe it captured BPM for an acoustic guitar)
* Death Cab for Cutie (maybe not the right context to feel emo)
* Brother Ali (..but this came at the right time)
* Norah Jones (oh boy)
* Jamiroquai (this made me virtually insane)

So yeah, maybe I should have looked through the songs in the playlist first.
Or only pull in certain genres by querying [beets](https://beets.io/) (a very cool tool, but probably a whole other post of its own).

It might not have been the ideal soundtrack for a PR (my actual finishing time was pretty middling), but it at least wasn't as bad [as this playlist](https://www.instagram.com/p/DDArgXQRn8n/).

[cadence]: https://www.trainingpeaks.com/blog/finding-your-perfect-run-cadence/