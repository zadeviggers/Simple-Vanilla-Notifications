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
	dismiss: () => void;
	id: NotificationID;
	// eslint-disable-next-line
	timeoutID?: ReturnType<typeof window.setTimeout> | any;
	contents: NotificationContents;
	element: HTMLElement;
	animated: boolean;
}

export interface NotificationManagerOptions {
	container?: HTMLElement | null;
	defaultAutoDismissTimeout?: number;
	defaultDismissible?: boolean;
	defaultAnimated?: boolean;
	defaultExitAnimationTime?: number;
	documentInstance?:
		| Document
		| { createElement: (tagName: string) => HTMLElement };
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

export function shouldAnimate(animationPreference: boolean): boolean {
	const motionNotOk: boolean | null = window?.matchMedia?.(
		"(prefers-reduced-motion: reduce)"
	).matches;

	// Never animate if the user prefers reduced motion
	if (motionNotOk) {
		return false;
	}

	// Otherwise use the default
	return animationPreference;
}

export function createNotificationManager({
	container,
	defaultAnimated = true,
	defaultDismissible = true,
	defaultExitAnimationTime = 350,
	defaultAutoDismissTimeout = 3200,
	documentInstance = window.document,
}: NotificationManagerOptions = {}): NotificationManager {
	let destroyed = false;

	const containerElement: NotificationManager["element"] =
		container || documentInstance.createElement("output");
	if (!container && "body" in documentInstance) {
		documentInstance.body.appendChild(containerElement);
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
			animated = defaultAnimated,
			exitAnimationTime = defaultExitAnimationTime,
		}: NotificationOptions = {}
	): Notification {
		if (destroyed) {
			throw new NotificationManagerDestroyedError();
		}

		const willAnimate = shouldAnimate(animated);

		const id = getNextNotificationID(activeNotifications);

		const notificationElement =
			element || documentInstance.createElement("div");
		notificationElement.classList.add("svn-notification");
		notificationElement.setAttribute("role", "status");
		notificationElement.setAttribute("aria-live", "polite");
		if (willAnimate) {
			notificationElement.classList.add("svn-animated");
		}

		if (typeof contents === "string") {
			const notificationContentsElement =
				documentInstance.createElement("span");
			notificationContentsElement.classList.add("svn-notification-text");
			notificationContentsElement.innerText = contents;
			notificationElement.appendChild(notificationContentsElement);
		} else {
			notificationElement.appendChild(contents);
		}

		let timeoutID: Notification["timeoutID"];

		function destroy(destroyElement = true) {
			// eslint-disable-next-line
			clearTimeout(timeoutID as any);
			if (destroyElement) {
				notificationElement.remove();
			}
			activeNotifications.delete(id);
		}

		function dismiss() {
			console.log("Dismissed");
			if (!willAnimate) {
				destroy();
			}
			notificationElement.classList.add("svn-exiting");
			destroy(false); // Remove the notification internally without removing it's element
			setTimeout(destroy, exitAnimationTime);
		}

		// If the timeout should happen, schedule it
		if (autoDismissTimeout > 0) {
			// eslint-disable-next-line
			timeoutID = setTimeout(dismiss, autoDismissTimeout) as any;
		}

		if (dismissible) {
			const closeButton = documentInstance.createElement("button");
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
			animated: willAnimate,
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
