---
layout: post
title: Getting the PPPoE Credentials from your C4000XG without calling CenturyLink
---

If you've switched to CenturyLink recently, you might want to hook up your own router directly to the ONT, and bypass the router they provide/rent to you.

This is pretty easy to do! See [this Reddit post for more details](https://www.reddit.com/r/centurylink/comments/ic4asm/howto_you_may_not_need_that_c4000xg_or_whatever/).

One thing you'll need to get from your ISP is the PPPoE userid and password the router uses to connect up to CenturyLink.
Normally this requires a phone call, but if they provided you a Greenwave C4000XG, you can grab it from the router's admin console.

Simply log in to the C4000XG's web UI, and go to Advanced Setup -> WAN Settings, with your DevTools open.
Look for the XHR request `/cgi/cgi_get?Object=Device.PPP.Interface`, and root around the JSON to find the credentials:

![clink credentials](/content/images/clink-router.png)

Or, just paste this into your console:

```js
fetch('/cgi/cgi_get?Object=Device.PPP.Interface', {
  headers: new Headers({
    'X-Requested-With': 'XMLHttpRequest',
  }),
})
  .then((d) => d.json())
  .then((res) => {
    const data = res.Objects.find((x) => x.ObjName === 'Device.PPP.Interface.1')
      .Param;
    const user = data.find((x) => x.ParamName === 'Username');
    const pass = data.find((x) => x.ParamName === 'Password');
    console.log(`User: ${user.ParamValue}`);
    console.log(`Pass: ${pass.ParamValue}`);
  });
```

Not sure if this is service journalism or just a reminder to myself when I forget in a month!
