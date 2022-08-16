# Changelog

## 2.1.0

### Minor changes

Make default container scrollable.

### Patch changes

Fix issues deploying on Cloudflare.

## 2.0.0

### Major changes

- The `timeout` option has been renamed to `autoDismissTimeout` and `defaultAutoDismissTimeout`.
- The `autoDismissTimeout` option no longer accepts a boolean. Set it to a number less tha or equal to zero to disable auto-dismissing notifications.
- All of the methods to `destroy` a notification have been renamed to `dismiss`.

### Minor changes

#### Animations

Animations are now supported!

- Added `animated` and `defaultAnimated` options to enable or disable animations.
- Added `exitAnimationTime` and `defaultExitAnimationTime` options to change the amount of time the notification gets to animate out before it's removed from the DOM.
