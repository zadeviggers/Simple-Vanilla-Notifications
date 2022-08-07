export type NotificationID = number;
export type NotificationContents = string | HTMLElement;

export type ActiveNotifications = Map<NotificationID, Notification>;

export interface NotificationOptions {
	element?: HTMLElement;
	dismissible?: boolean;
	timeout?: number | boolean;
}

export interface Notification {
	id: NotificationID;
	timeoutID?: any;
	contents: NotificationContents;
	element: HTMLElement;
	destroy: () => void;
}

export interface NotificationManagerOptions {
	container?: HTMLElement | null;
	defaultTimeout?: number;
	defaultDismissible?: boolean;
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
}: NotificationManagerOptions = {}): NotificationManager {
	let destroyed = false;
	let containerElement: HTMLElement =
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
		}: NotificationOptions = {}
	): Notification {
		if (destroyed) throw new NotificationManagerDestroyedError();
		const notificationElement = element || document.createElement("div");
		const id = getNextNotificationID(activeNotifications);
		notificationElement.classList.add("svn-notification");
		notificationElement.setAttribute("role", "status");
		notificationElement.setAttribute("aria-live", "polite");

		if (typeof contents === "string") notificationElement.innerText = contents;
		else if (contents instanceof HTMLElement)
			notificationElement.appendChild(contents);

		let timeoutID: any;

		function destroy() {
			clearTimeout(timeoutID);
			notificationElement.remove();
			activeNotifications.delete(id);
		}

		let actualTimeout = defaultTimeout;
		// If timeout is set to true, use the default
		if (timeout === true) actualTimeout = defaultTimeout;

		// If the timeout should happen, schedule it
		if (typeof timeout === "number" || timeout === true)
			timeoutID = setTimeout(destroy, actualTimeout);

		if (dismissible) {
			const closeButton = document.createElement("button");
			closeButton.classList.add("svn-notification-close-button");
			closeButton.innerText = "X";
			closeButton.addEventListener("click", destroy);
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
