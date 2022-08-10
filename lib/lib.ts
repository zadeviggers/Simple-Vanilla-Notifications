export type NotificationID = number;
export type NotificationContents = string | HTMLElement;

export type ActiveNotifications = Map<NotificationID, Notification>;

export interface NotificationOptions {
	element?: HTMLElement;
	dismissible?: boolean;
	timeout?: number;
	animated?: boolean;
	animationTime?: number;
}

export interface Notification {
	id: NotificationID;
	timeoutID?: number;
	contents: NotificationContents;
	element: HTMLElement;
	destroy: () => void;
}

export interface NotificationManagerOptions {
	container?: HTMLElement | null;
	defaultTimeout?: number;
	defaultDismissible?: boolean;
	defaultAnimated?: boolean;
	defaultAnimationTime?: number;
}

export interface NotificationManager {
	createNotification: (
		contents: NotificationContents,
		options?: NotificationOptions
	) => Notification;
	destroyNotification: (notificationID: NotificationID) => void;
	destroyAllNotifications: () => void;
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
	for (const key of activeNotifications.keys())
		if (key > highestID) highestID = key;
	return highestID + 1;
}

export function createNotificationManager({
	defaultTimeout = 3200,
	container,
	defaultDismissible = true,
	defaultAnimated = true,
	defaultAnimationTime = 250,
}: NotificationManagerOptions = {}): NotificationManager {
	let destroyed = false;

	const containerElement: HTMLElement =
		container || document.createElement("output");
	if (!container) document.body.appendChild(containerElement);
	containerElement.classList.add("svn-notifications-container");

	const activeNotifications: ActiveNotifications = new Map();

	function createNotification(
		contents: NotificationContents,
		{
			element,
			dismissible = defaultDismissible,
			timeout = defaultTimeout,
			animated = defaultAnimated,
			animationTime = defaultAnimationTime,
		}: NotificationOptions = {}
	): Notification {
		if (destroyed) throw new NotificationManagerDestroyedError();

		const id = getNextNotificationID(activeNotifications);

		const notificationElement = element || document.createElement("div");
		notificationElement.classList.add("svn-notification");
		notificationElement.setAttribute("role", "status");
		notificationElement.setAttribute("aria-live", "polite");
		if (animated) notificationElement.classList.add("animated");

		if (typeof contents === "string") notificationElement.innerText = contents;
		else if (contents instanceof HTMLElement)
			notificationElement.appendChild(contents);

		let timeoutID: number | undefined;

		function destroy(destroyElement = true) {
			clearTimeout(timeoutID);
			if (destroyElement) notificationElement.remove();
			activeNotifications.delete(id);
		}

		function dismiss() {
			if (!animated) destroy();
			notificationElement.classList.add("exiting");
			destroy(false); // Remove the notification internally without removing it's element
			setTimeout(destroy, animationTime);
		}

		// If the timeout should happen, schedule it
		if (timeout > 0) timeoutID = setTimeout(dismiss, timeout);

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
			destroy,
		};

		containerElement.appendChild(notificationElement);
		activeNotifications.set(id, notification);

		return notification;
	}

	function destroyNotification(notificationID: NotificationID) {
		if (destroyed) throw new NotificationManagerDestroyedError();
		activeNotifications.get(notificationID)?.destroy();
	}

	function destroyAllNotifications() {
		if (destroyed) throw new NotificationManagerDestroyedError();
		activeNotifications.forEach((notification) => notification.destroy());
	}

	function destroy() {
		if (destroyed) throw new NotificationManagerDestroyedError();
		destroyAllNotifications();
		containerElement.remove();
		destroyed = true;
	}

	return {
		activeNotifications,
		destroyed,
		createNotification,
		destroyNotification,
		destroyAllNotifications,
		destroy,
		element: containerElement,
	};
}
