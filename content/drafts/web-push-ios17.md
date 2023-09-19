title: Web Push is almost usable with iOS 17

---

Apple got a lot of positive sentiment when they launched betas of iOS 16.4 and announced support for Web Push, along with other features.
The problem was: it was completely unusable.

Was announced as "If you coded to web standards, it will Just Work for your users". Reality was pretty different.

iOS 17 fixes a lot of the issues, but it's still probably not something you'll be able to rely on

## No longer requires Feature Flags/Experimental Features to be set
## Still requires add to homescreen
## Can feature detect by checking for `registration.pushManager` or `window.PushManager` in addition to SW support
