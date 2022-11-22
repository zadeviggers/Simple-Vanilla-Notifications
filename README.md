# Simple Vanilla Notifications

Quick to set up, easy to customise notifications/snackbars/toasts for vanilla JavaScript (or TypeScript!) websites.

[Demo](https://svn.pages.dev/) | [GitHub](https://github.com/zadeviggers/Simple-Vanilla-Notifications) | [NPM](https://www.npmjs.com/package/simple-vanilla-notifications)

```
pnpm add simple-vanilla-notifications
```

## Example

```ts
import "simple-vanilla-notifications/defaults.css";
import { createNotificationManager } from "simple-vanilla-notifications";

const { createNotification } = createNotificationManager();

const notification = createNotification("Task failed successfully!");

notification.dismiss();
```

## Usage

### `Notification`

```ts
const { createNotification } = createNotificationManager();
const notification = createNotification("What's popping?");

console.log(notification.id); // The Notification's ID. Can be passed to dismissNotification().
console.log(notification.contents); // Whatever was passed as the first argument to createNotification().
console.log(notification.element); // The notification's HTML element.
console.log(notification.animated); // Whether the notification was animated. Always false if `(prefers-reduced-motion: reduce)` is set. Available since version 3.1.0.
notification.dismiss(); // Dismiss the notification. Used internally by the dismiss button.
```

### `createNotificationManager()`

```ts
import { createNotificationManager } from "simple-vanilla-notifications";

const { createNotification } = createNotificationManager({
	// The element that the notifications appear in.
	// If this is unset, a <output> element will automatically be created and added to the bottom of the body.
	// Unless you have a specific use case, I recommend leaving this blank.
	container: document.getElementByID("my-custom-container-element"),

	// The amount of time after which notifications disappear on their own.
	// Set this to a number <= 0 to disable the auto-dismiss functionality.
	// This can be overridden for each individual notification.
	defaultAutoDismissTimeout: 3200,

	// Whether or not to automatically add a dismiss button to the notifications.
	// This can be overridden for each individual notification.
	defaultDismissible: true,

	// Whether to animate notifications.
	// This can be overridden for each individual notification.
	// NOTE: This doesn't actually animate notifications, it just adds an extra class to the elements. The animation is implemented in CSS.
	// `(prefers-reduced-motion: reduce)` overrides this.
	defaultAnimated: true,

	// The amount to time to keep notification elements in the DOM after they're dismissed.
	// This can be overridden for each individual notification.
	// NOTE: This doesn't actually animate the notifications, it just adds an extra class to the elements. The animation is implemented in CSS.
	defaultExitAnimationTime: 3200,
});

createNotification("Hi! I'm a notification!");
```

#### `createNotification()`

```ts
const { createNotification } = createNotificationManager();

createNotification(":))))", {
	// The HTML element to use to render the notification.
	element: document.createElement("div"),

	// The amount of time after which the notification disappears on it's own.
	// Set this to a number <= 0 to disable the auto-dismiss functionality.
	autoDismissTimeout: 3200,

	// Whether or not to automatically add a dismiss button to the notifications.
	// If this is unset, it uses the defaultDismissible value set in createNotificationManager.
	dismissible: true,

	// Whether to animate the notification.
	// If this is unset, it uses the defaultAnimated value set in createNotificationManager.
	// NOTE: This doesn't actually animate the notification, it just adds an extra class to the element. The animation is implemented in CSS.
	// `(prefers-reduced-motion: reduce)` overrides this.
	animated: true,

	// The amount to time to keep the notification element in the DOM after it's dismissed.
	// If this is unset, it uses the defaultExitAnimationTime value set in createNotificationManager.
	// NOTE: This doesn't actually animate the notification, it just adds an extra class to the element. The animation is implemented in CSS.
	exitAnimationTime: 3200,
});

// You can also pass an element as the notification contents.
const el = document.createElement("a");
el.setAttribute("href", "https://youtu.be/dQw4w9WgXcQ");
createNotification(el);
```

#### `dismissNotification()`

```ts
const { createNotification, dismissNotification } = createNotificationManager();
const notification = createNotification("What is love?");

// Dismisses a notification using it's ID
dismissNotification(notification.id);
```

#### `dismissAllNotifications()`

```ts
const { createNotification, dismissAllNotifications } =
	createNotificationManager({
		defaultDismissible: false,
		defaultAutoDismissTimeout: false,
	});

createNotification("Baby don't hurt me,");
createNotification("don't hurt me,");

// Dismisses all notifications. Useful for cleaning up when a component is unmounted.
dismissAllNotifications();
```

#### `activeNotifications`

```ts
const { createNotification, activeNotifications } = createNotificationManager();
createNotification("No more.");

console.log(activeNotifications); // A Map of NotificationsIDs to Notification objects
```

#### `element`

```ts
const { element } = createNotificationManager();

// The container element that notifications are rendered inside of
console.log(element); // HTMLElement
```

#### `destroy()`

```ts
const { createNotification, destroy } = createNotificationManager();

createNotification("Gas Gas Gas");
createNotification("I'm gonna step on the gas");

// Destroys all notifications, the container element, and renders the notification manager useless.
destroy();

// After destroy() is called, all functions throw errors when called.
createNotification("Tonight, I'll fly (and be your lover)"); // Error!
```

#### `destroyed`

```ts
const { createNotification, destroy, destroyed } = createNotificationManager();

createNotification("We're going on a trip, in our favourite rocket ship");

console.log(destroyed); // false

destroy();

console.log(destroyed); // true
```

## Customising

Super easy to customise! You can just stop importing the `defaults.css` file and write your own styles to customise how the notifications look. The classes are as follows:

```css
/* The notifications wrapper element. Use this to position them on the screen */
.svn-notifications-container {
}
/* The notifications themselves. Don't like the shadow? This is where you change it. */
.svn-notification {
}
/* Notifications that should be animated. This is where the enter animation should be. */
.svn-notification.svn-animated {
}
/* Exiting animated notifications. This is where the exit animation should be. */
.svn-notification.svn-animated.svn-exiting {
}
/* The close button on notifications that have it enabled */
.svn-notification-close-button {
}
```

## Typescript

The library is written in Typescript, so there should be built-in definitions. It should just work, but I may have messed up the build system so please open an issue if something's broken.

## Server-Side Rendering

Make sure that you don't call `createNotificationManager` until it's in an enviroment that has `window` and `document` available. Most of the time, this means that you should only call it client side.
You can do this in Solid by creating a signal for the notification manager that's initially null, and then create the manager and stick it in the Signal inside of an effect.

## Clean up

Most of the time you probably don't need to worry about this because you'll only have a single notification manager, but in some cases you might need to remove all of the notifications, or everything, including the notification container.

There are two useful functions for this, both returned from `createNotificationManager`: `destroy` which destroys all of the active notifications and the container element (keep in mind that after calling this the notification manager is rendered completely useless, so only call this when you REALLY don't need it any more), and `dismissAllNotifications` which does what it says on the tin.
