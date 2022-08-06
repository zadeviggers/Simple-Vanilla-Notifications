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
	activeNotifications: ActiveNotifications;
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
	if (!container) {
		container = document.createElement("output");
		document.body.appendChild(container);
	}
	container.classList.add("svn-notifications-container");

	const activeNotifications: ActiveNotifications = new Map();

	function createNotification(
		contents: NotificationContents,
		{
			element = document.createElement("div"),
			dismissible = defaultDismissible,
			timeout = defaultTimeout,
		}: NotificationOptions = {}
	): Notification {
		const id = getNextNotificationID(activeNotifications);
		element.classList.add("svn-notification");
		element.setAttribute("role", "status");
		element.setAttribute("aria-live", "polite");

		if (typeof contents === "string") element.innerText = contents;
		else if (contents instanceof HTMLElement) element.appendChild(contents);

		let timeoutID: any;

		function destroy() {
			clearTimeout(timeoutID);
			element.remove();
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
			element.appendChild(closeButton);
		}

		const notification: Notification = {
			id,
			timeoutID,
			contents,
			element,
			destroy,
		};

		container?.appendChild(element);
		activeNotifications.set(id, notification);

		return notification;
	}

	function destroyNotification(notificationID: NotificationID): void {
		activeNotifications.get(notificationID)?.destroy();
	}

	return {
		activeNotifications,
		createNotification,
		destroyNotification: destroyNotification,
	};
}
