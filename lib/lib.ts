export type NotificationID = number;
export type NotificationContents = string | HTMLElement;

export type ActiveNotifications = Map<NotificationID, Notification>;

export interface NotificationOptions {
	element?: HTMLElement;
	dismissible?: boolean;
	autoDismissTimeout?: number;
	animated?: boolean;
	exitAnimationTime?: number;
}

export interface Notification {
	id: NotificationID;
	// eslint-disable-next-line
	timeoutID?: ReturnType<typeof window.setTimeout> | any;
	contents: NotificationContents;
	element: HTMLElement;
	dismiss: () => void;
}

export interface NotificationManagerOptions {
	container?: HTMLElement | null;
	defaultAutoDismissTimeout?: number;
	defaultDismissible?: boolean;
	defaultAnimated?: boolean;
	defaultExitAnimationTime?: number;
}

export interface NotificationManager {
	createNotification: (
		contents: NotificationContents,
		options?: NotificationOptions
	) => Notification;
	dismissNotification: (notificationID: NotificationID) => void;
	dismissAllNotifications: () => void;
	destroy: () => void;
	destroyed: boolean;
	element: HTMLElement;
	activeNotifications: ActiveNotifications;
}

export class NotificationManagerDestroyedError extends Error {
	message =
		"The notification manager has been destroyed, so none of the functions work any more.";
}

export function getNextNotificationID(
	activeNotifications: ActiveNotifications
): NotificationID {
	let highestID = -1;
	for (const key of activeNotifications.keys()) {
		if (key > highestID) {
			highestID = key;
		}
	}
	return highestID + 1;
}

export function shouldAnimate(defaultAnimated: boolean): boolean {
	const motionOk = window.matchMedia(
		"(prefers-reduced-motion: no-preference)"
	).matches;

	// Never animate if the user prefers reduced motion
	if (!motionOk) {
		false;
	}

	// Otherwise use the default
	return defaultAnimated;
}

export function createNotificationManager({
	defaultAutoDismissTimeout = 3200,
	container,
	defaultDismissible = true,
	defaultAnimated = true,
	defaultExitAnimationTime = 350,
}: NotificationManagerOptions = {}): NotificationManager {
	let destroyed = false;

	const containerElement: NotificationManager["element"] =
		container || document.createElement("output");
	if (!container) {
		document.body.appendChild(containerElement);
	}
	containerElement.classList.add("svn-notifications-container");

	const activeNotifications: ActiveNotifications = new Map();

	function createNotification(
		contents: NotificationContents,
		{
			element,
			dismissible = defaultDismissible,
			autoDismissTimeout = defaultAutoDismissTimeout,
			/* Compute this every time, because the user could theoretically
			change their preference while the page is open */
			animated = shouldAnimate(defaultAnimated),
			exitAnimationTime = defaultExitAnimationTime,
		}: NotificationOptions = {}
	): Notification {
		if (destroyed) {
			throw new NotificationManagerDestroyedError();
		}

		const id = getNextNotificationID(activeNotifications);

		const notificationElement = element || document.createElement("div");
		notificationElement.classList.add("svn-notification");
		notificationElement.setAttribute("role", "status");
		notificationElement.setAttribute("aria-live", "polite");
		if (animated) {
			notificationElement.classList.add("svn-animated");
		}

		if (typeof contents === "string") {
			const notificationContentsElement = document.createElement("span");
			notificationContentsElement.classList.add("svn-notification-text");
			notificationContentsElement.innerText = contents;
			notificationElement.appendChild(notificationContentsElement);
		} else if (contents instanceof HTMLElement) {
			notificationElement.appendChild(contents);
		}

		let timeoutID: Notification["timeoutID"];

		function destroy(destroyElement = true) {
			// eslint-disable-next-line
			window.clearTimeout(timeoutID as any);
			if (destroyElement) {
				notificationElement.remove();
			}
			activeNotifications.delete(id);
		}

		function dismiss() {
			console.log("Dismissed");
			if (!animated) {
				destroy();
			}
			notificationElement.classList.add("svn-exiting");
			destroy(false); // Remove the notification internally without removing it's element
			window.setTimeout(destroy, exitAnimationTime);
		}

		// If the timeout should happen, schedule it
		if (autoDismissTimeout > 0) {
			// eslint-disable-next-line
			timeoutID = setTimeout(dismiss, autoDismissTimeout) as any;
		}

		if (dismissible) {
			const closeButton = document.createElement("button");
			closeButton.classList.add("svn-notification-close-button");
			closeButton.innerText = "X";
			closeButton.addEventListener("click", dismiss);
			notificationElement.appendChild(closeButton);
		}

		const notification: Notification = {
			id,
			timeoutID,
			contents,
			element: notificationElement,
			dismiss,
		};

		containerElement.appendChild(notificationElement);
		activeNotifications.set(id, notification);

		return notification;
	}

	function dismissNotification(notificationID: NotificationID) {
		if (destroyed) {
			throw new NotificationManagerDestroyedError();
		}
		activeNotifications.get(notificationID)?.dismiss();
	}

	function dismissAllNotifications() {
		if (destroyed) {
			throw new NotificationManagerDestroyedError();
		}
		activeNotifications.forEach((notification) => notification.dismiss());
	}

	function destroy() {
		if (destroyed) {
			throw new NotificationManagerDestroyedError();
		}
		dismissAllNotifications();
		containerElement.remove();
		destroyed = true;
	}

	return {
		activeNotifications,
		destroyed,
		createNotification,
		dismissNotification,
		dismissAllNotifications,
		destroy,
		element: containerElement,
	};
}
