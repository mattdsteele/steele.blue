---
layout: post
title: 'Building Fast, Tiny GitHub Actions with Go and Docker'
---

[GitHub Actions](https://github.com/features/actions) are sweet! It's still in beta but it's a great way to automate tasks after things happen like code pushes, comments on Issues, pull requests, etc.

As an author of a GitHub Action, I'm really enamored by the architecture: each "build" is run on a virtual machine in Azure, with each action running inside a Docker container that GitHub executes. As Kyle Daigle mentions on [a Changelog podcast:](https://changelog.com/podcast/331#transcript-94):

> As a small developer my entire side business could be a Docker container. Not running it, not supporting the payment for it, just a Docker container.

GitHub does this by building and executing your Docker container on the fly. So if you want your Action to finish quickly, you'll want to spend some time optimizing.

These are lessons I've learned building an action to [execute a Particle function](https://github.com/marketplace/actions/particle-function). I'm not an expert, but they worked for me!

## Optimization 1: Use a container deployed to Docker Hub

You can reference an action by pointing to a GitHub repository containing its source:

```yml
# Compiled just-in-time
uses: mattdsteele/particle-action@master
```

But, the first step for each of your user's workflow will be to checkout the action's source and compile the container. This takes time!

So, if you build the container and publish it to a Docker registry like [Docker Hub](https://hub.docker.com/):

```yml
# Precompiled, users just pull the container
- uses: docker://mattdsteele/particle-github-action:latest
```

For my particular action, this improves builds by **over 60 seconds!**

Of course, you'll need to build and upload your container each time you push a change to your action. Luckily, [there's a GitHub Action for that](https://github.com/marketplace/actions/build-tag-publish-docker) :)

## Optimization 2: Trim your Docker images

When referencing a Docker registry, GitHub has to download the image each time. And if you're not careful, Docker containers can be massive, which can slow down how fast your action executes. So the smaller you can make your container, the better.

### Don't rely on a big parent image

My first version of the action relied on `curl`, which even on a large-ish base like Debian wasn't available by default. So here's where I started:

```bash
$ docker images
REPOSITORY                SIZE
particle-bash             90.8MB
```

Switching from Debian to a smaller Linux base like alpine is a great way to start optimizing:

```bash
REPOSITORY                SIZE
particle-alpine           12.6MB
```

Better!

### Build a self-contained executable in Go

Going further, we can use Go to build a single, self-contained executable that doesn't rely on any operating system tools! So, I rewrote the action, switched the base to `FROM golang:latest`, and got this:

```bash
REPOSITORY                SIZE
particle-golang           810MB
```

Yikes! This is due to Docker images being additive; so the container includes the entire Go build toolchain.

### Use a Docker multi-stage build

Let's fix this by setting up a [Docker multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/), where we build the Go binary in one stage, and copy it into the [empty "scratch" image](https://docs.docker.com/develop/develop-images/baseimages/):

```Dockerfile
# build stage
FROM golang:alpine AS build-env
RUN apk --no-cache add build-base git gcc ca-certificates
COPY go.mod particle.go /src/
RUN cd /src && go build -o main

# final stage
FROM scratch

COPY --from=build-env /src/main /
COPY --from=build-env /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/main"]
```

(I also had to copy over the SSL certificates to the scratch image, since I was making HTTPS calls.)

```bash
REPOSITORY                SIZE
particle-scratch          7.27MB
```

Nice!

### Optimize the Go binary

We can optimize the image size further by optimizing the Go binary with a couple flags:

```Dockerfile
RUN cd /src && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o main
```

Another improvement:

```bash
REPOSITORY                SIZE
particle-scratch-optim    5.33MB
```

In total, these optimizations took my GitHub action from a **6+ minute run down to 30 seconds**. Pretty sweet when you're [waiting for the action to complete to get candy](https://web.archive.org/web/20190922131203/https://twitter.com/mattdsteele/status/1173628386742345728).
