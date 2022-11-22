# Changelog

## 3.2.0

### Minor Changes

More reasonable SSR Support!

- You can now pass `createNotificationManager` a `documentInstance` option to use a `Document` instance that isn't on the global object, for example,`deno_dom`.
- All calls to methods on `document` other than `createElement` will be null-checked, so you can write your own super bare-bones document implementation if you're feeling crazy.
- Changed `window.whatever()` calls to `whatever()` for environments that use a different global object.
- The notification container will only be appended onto the end of the body if `body` exists on the `documentInstance`.

## 3.1.1

### Patch changes

Fix `(prefers-reduced-motion: reduce)` override not working because somehow I forgot to write `return` (I blame the linter).

## 3.1.0

### Minor changes

Exposes `animated` on the `Notification` type.

### Patch changes

Fix bug with `(prefers-reduced-motion: reduce)` not overriding `animated` properly.

## 3.0.1

### Patch changes

Respect `(prefers-reduced-motion: reduce)`. This will override the animate parameter.

## 3.0.0

#### Major changes

Removes that annoying white bar fro the side of the notification stack. This should be a patch, but I'm making it a major because technically it's breaking since you can't scroll the notification stack if it overflows any more.

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
