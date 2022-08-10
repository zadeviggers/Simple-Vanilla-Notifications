# Simple Vanilla Notifications

[Demo](https://svn.pages.dev/) | [GitHub](https://github.com/zadeviggers/Simple-Vanilla-Notifications) | [NPM](https://www.npmjs.com/package/simple-vanilla-notifications)

Quick to set up, easy to customise notifications/snackbars/toasts for vanilla JavaScript websites.

```
pnpm add simple-vanilla-notifications
```

## Example

```ts
import "simple-vanilla-notifications/defaults.css";
import { createNotificationManager } from "simple-vanilla-notifications";

const { createNotification } = createNotificationManager();

const notification = createNotification("Task failed successfully!");

notification.destroy();
```

## Usage

### `Notification`

```ts
const { createNotification } = createNotificationManager();
const notification = createNotification("What's popping?");

console.log(notification.id); // The Notification's ID. Can be passed to destroyNotification().
console.log(notification.contents); // Whatever was passed as the first argument to createNotification().
console.log(notification.element); // The notification's HTML element.
notification.destroy(); // Destroy the notification. Used internally by the dismiss button.
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
	defaultTimeout: 3200,

	// Whether or not to automatically add a dismiss button to the notifications.
	// This can be overridden for each individual notification.
	defaultDismissible: true,
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
	timeout: 3200,

	// Whether or not to automatically add a dismiss button to the notifications.
	// If this is unset, it uses the defaultDismissible value set in createNotificationManager.
	dismissible: true,
});

// You can also pass an element as the notification contents.
const el = document.createElement("a");
el.setAttribute("href", "https://youtu.be/dQw4w9WgXcQ");
createNotification(el);
```

#### `destroyNotification()`

```ts
const { createNotification, destroyNotification } = createNotificationManager();
const notification = createNotification("What is love?");

// Destroys a notification using it's ID
destroyNotification(notification.id);
```

#### `destroyAllNotifications()`

```ts
const { createNotification, destroyAllNotifications } =
	createNotificationManager({
		defaultDismissible: false,
		defaultTimeout: false,
	});

createNotification("Baby don't hurt me,");
createNotification("don't hurt me,");

// Destroys all notifications. Useful for cleaning up when a component is unmounted.
destroyAllNotifications();
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
/* The close button on notifications that have it enabled */
.svn-notification-close-button {
}
```

## Typescript

The library is written in Typescript, so there should be built-in definitions. It should just work, but I may have messed up the build system so please open an issue if something's broken.

## Server-Side Rendering

Make sure that you don't call `createNotificationManager` until it's in a context that has the document object available. Most of the time, this means that you should only call it client side.
You can do this in Solid by creating a signal for the notification manager that's initially null, and then create the manager and stick it in the Signal inside of an effect.

## Clean up

Most of the time you probably don't need to worry about this because you'll only have a single notification manager, but in some cases you might need to remove all of the notifications, or everything, including the notification container.

There are two useful functions for this, both returned from `createNotificationManager`: `destroy` which destroys all of the active notifications and the container element (keep in mind that after calling this the notification manager is rendered completely useless, so only call this when you REALLY don't need it any more), and `destroyAllNotifications` which does what it says on the tin.
