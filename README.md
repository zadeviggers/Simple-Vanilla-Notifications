# Simple Vanilla Notifications

Quick to set up, easy to customise notifications/snackbars/toasts for vanilla JavaScript websites.

```
pnpm add simple-vanilla-notifications
```

## Example

```ts
import { createNotificationManager } from "simple-vanilla-notifications";

const { createNotification } = createNotificationManager();

const notification = createNotification("*dabs*");

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

### `createNotificationManager`

```ts
import { createNotificationManager } from "simple-vanilla-notifications";

const { createNotification } = createNotificationManager({
	// The element that the notifications appear in.
	// If this is unset, a <output> element will automatically be created and added to the bottom of the body.
	// Unless you have a specific use case, I recommend leaving this blank.
	container: document.getElementByID("my-custom-container-element"),

	// The amount of time after which notifications disappear on their own.
	// Set this to false to disable the auto-dismiss functionality.
	// This can be overridden for each individual notification.
	defaultTimeout: 3200,

	// Whether or not to automatically add a dismiss button to the notifications.
	// This can be overridden for each individual notification.
	defaultDismissible: true,
});

createNotification("Hi! I'm a notification!");
```

#### `createNotification`

```ts
const { createNotification } = createNotificationManager();

createNotification(":))))", {
	// The HTML element to use to render the notification.
	element: document.createElement("div"),

	// The amount of time after which the notification disappears on it's own.
	// Set this to false to disable the auto-dismiss functionality.
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

#### `destroyNotification`

```ts
const { createNotification, destroyNotification } = createNotificationManager();
const notification = createNotification("What is love?");

// Destroys a notification using it's ID
destroyNotification(notification.id);
```

#### `activeNotifications`

```ts
const { createNotification, activeNotifications } = createNotificationManager();
createNotification("Baby don't hurt me,");

console.log(activeNotifications); // A Map of NotificationsIDs to Notification objects
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
