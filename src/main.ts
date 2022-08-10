import "../lib/defaults.css";
import "./styles.css";
import { createNotificationManager, getNextNotificationID } from "../lib";

const { createNotification, activeNotifications, dismissAllNotifications } =
	createNotificationManager();
// @ts-expect-error Add to window without sacrificing types
window.activeNotifications = activeNotifications;
const autoDismissCheckbox: HTMLInputElement = document.getElementById(
	"auto-dismiss"
) as HTMLInputElement;

const dismissButtonCheckbox: HTMLInputElement = document.getElementById(
	"dismiss-button"
) as HTMLInputElement;

(
	document.getElementById("create-notification-button") as HTMLButtonElement
).addEventListener("click", () => {
	const id = getNextNotificationID(activeNotifications);
	createNotification(`Hello there! I am number #${id}`, {
		autoDismissTimeout: autoDismissCheckbox.checked ? 3200 : 0,
		dismissible: dismissButtonCheckbox.checked,
	});
	createNotification("Looooooooooooooooooooooooong", {
		autoDismissTimeout: autoDismissCheckbox.checked ? 3200 : 0,
		dismissible: dismissButtonCheckbox.checked,
	});
});

(
	document.getElementById("dismiss-all-button") as HTMLButtonElement
).addEventListener("click", dismissAllNotifications);
