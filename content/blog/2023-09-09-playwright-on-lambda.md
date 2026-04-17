---
title: Running a Playwright script on AWS Lambda
layout: post
---

I had a hell of a time getting a [Playwright script](https://playwright.dev/) to successfully run in an AWS Lambda.
There's a few guides on various ways to handle this, but none of them worked out of the box.
For posterity, here's what worked for me.

## Use a Docker Container

The two primary ways I've seen Playwright and Puppeteer implemented are:

1. Using the default Node runtime, with the Chromium browser installed as a separate layer. This is the approach taken by the [chromium-lambda](https://web.archive.org/web/20230915084229/https://www.npmjs.com/package/@sparticuz/chromium) npm package.
2. Using a Lambda Docker runtime, building off a Microsoft-provided base layer with Chromium pre-installed.

I was never able to make the Node runtime work, but did have success with the Docker runtime, so I'd recommend using that architecture.

Most of this started from Lari Haataja's [excellent blog post](https://larihaataja.com/running-e2e-tests-playwright-aws-lambda/) on the various options and configuration needed to get started.

## Write a standard Playwright script

You can follow the basic guidelines [in the Playwright docs](https://playwright.dev/docs/api/class-playwright) to launch your script.

I found it was helpful to move the Playwright code to a shared file, and have an entry point import it to run locally, and a second file with the Lambda specifics:

```ts
/* shared.ts contains Playwright logic */
import { LaunchOptions } from 'playwright';

export async function main(launchOptions: LaunchOptions): Promise<Result> {
  // launches the function
}
```

```ts
/* start-local.ts runs in "headful" mode */
import { main } from './shared';
const result = await main({ headless: false });
```

```ts
/* lambda.ts runs in "headless" mode */
import { APIGatewayProxyResult, EventBridgeEvent, Handler } from 'aws-lambda';
import { main } from './shared';

let args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  // More flags configured, see below
];

export const handler: Handler = async (
  event: EventBridgeEvent<'Location Geofence Event', GeofenceType>,
  context
): Promise<APIGatewayProxyResult> => {
  const results = await main({
    args,
    headless: true,
  });
};
```

You'll notice a number of `args` I passed into the Lambda - these are Chromium flags I found I had to enable to have Chromium launch successfully on the Lambda.
You can see a full list of them [in my repo](https://github.com/mattdsteele/spot-tracker-tracker/blob/main/pizza-function/src/lambda.ts#L7-L46), which I found from Vikash Loomba's GitHub.

## Dockerfile

Microsoft provides [Docker base images](https://playwright.dev/docs/docker) with browsers and dependencies already installed; so this will be the starting point for our containers.

Mostly this is following [the guide from Lari](https://larihaataja.com/running-e2e-tests-playwright-aws-lambda/#the-dockerfile), but I did have to pin down the specific version of the base layer so it corresponded to the Playwright version I was using (1.37.0), so my base layer looked like:

```Dockerfile
FROM mcr.microsoft.com/playwright:v1.37.0-focal as build-image
```

The container definition also bundles AWS's [Runtime Interface Emulator](https://github.com/aws/aws-lambda-runtime-interface-emulator/), which supports starting up the container locally, using Lambda's APIs.
I ended up not using this very often since I had a local, non-containerized entry point I could quickly run, but it was still a nice feature to have.

You can see the complete Dockerfile [here](https://github.com/mattdsteele/spot-tracker-tracker/blob/main/pizza-function/Dockerfile).

There's also an entrypoint bash script which is mostly boilerplate, and can be seen [here](https://github.com/mattdsteele/spot-tracker-tracker/blob/main/pizza-function/entrypoint.sh).

## Build and deploy the container

To deploy to AWS, you'll need to build the container, and deploy it to a container registry in your AWS tenant.
Most of this is boilerplate with the AWS CLI, and is documented on [Lari's post](https://larihaataja.com/running-e2e-tests-playwright-aws-lambda/#deploying-to-aws-lambda).

I found that I was running the build/deploy frequently enough that I added it to a shell script, which you can see [here](https://github.com/mattdsteele/spot-tracker-tracker/blob/main/pizza-function/deploy.sh).

On my (weak) machine it took about 5 minutes to build and push the container.
Once available, you can create a new Lambda function, and define it as a Container Image as documented [on AWS's page](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/), and deploy using the `latest` tag of your container.

I had to make a few other changes to the container's configuration:

- **Increase memory** - The default memory allocated wasn't high enough to launch and run Chromium, so I upped the memory at runtime to 3GB. You may be able to optimize this better to save some money.
- **Increase timeout** - My script took about 2 minutes to finish running, so I had to increase the timeout so Lambda wouldn't kill it after a few seconds.
- **Update `HOME` environment variable** When Chromium launches, it tries to put files in a subdirectory of `$HOME`, which isn't writable by default in a Lambda runtime. To get around this, you can set `HOME=/tmp` in the environment variables configuration. Thanks to [this GitHub issue](https://github.com/alixaxel/chrome-aws-lambda/issues/131#issuecomment-629541023) for the workaround.

Once it's all configured, you can treat this like any other function; and define triggering events using the AWS console, or whatever method you prefer.
You can also run test events through to validate the page is invoking successfully.

## Why go through all this? Would jsdom/WebDriver/Puppeteer be easier?

Having to start up an entire web browser to screen-scrape a site without an API is a giant pain, and I wouldn't recommend it as the primary approach to automating an action.
But some websites don't have an API, and depend heavily on JavaScript to render their site (this was a React SPA), so running a full browser was the only choice I could rely on.

There's a plethora of other automation tools out there, but I wanted to try out Playwright, and found their API surprisingly usable for humans. I'd recommend [this JS Party](https://changelog.com/jsparty/253) episode for a deeper introduction to Playwright.

## Bonus: Record and review video playbacks

I found it difficult to debug what was actually happening when my function would run. I could add additional `console.log` statements, but I found it was just easier to save off a recording of the automation run and upload it to an S3 bucket for later review.

This was fairly straightforward with Playwright's [video recording API](https://playwright.dev/docs/videos#record-video):

```ts
import { readFile } from 'fs/promises';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const S3_BUCKET = 'your-bucket-id';

async function uploadVideo(pathToVideo: string) {
  const Key = basename(pathToVideo);
  const Body = await readFile(pathToVideo);
  const client = new S3Client();
  const upload = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Body,
    Key
  });
  const result = await client.send(upload);
}
```

And with that, for each run you have a full playback video to inspect!
