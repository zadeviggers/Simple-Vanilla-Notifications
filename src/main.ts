import "../lib/defaults.css";
import "./styles.css";
import { createNotificationManager, getNextNotificationID } from "../lib";

const { createNotification, activeNotifications, destroyAllNotifications } =
	createNotificationManager();

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
		timeout: autoDismissCheckbox.checked,
		dismissible: dismissButtonCheckbox.checked,
	});
});

(
	document.getElementById("destroy-all-button") as HTMLButtonElement
).addEventListener("click", destroyAllNotifications);
