import "../lib/defaults.css";
import "./styles.css";
import {
	createNotificationManager,
	getNextNotificationID,
	NotificationContents,
} from "../lib";

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

const animateCheckbox: HTMLInputElement = document.getElementById(
	"animate"
) as HTMLInputElement;

function getRandomMessage(): NotificationContents {
	const num = Math.floor(Math.random() * 6);
	switch (num) {
		case 0: {
			const id = getNextNotificationID(activeNotifications);
			return `Hello there! I am number #${id}`;
		}
		case 1:
			return "Looooooooooooooooooooooooong";
		case 2:
			return "🫘 Emoji! 💯";
		case 3: {
			const el1 = document.createElement("span");
			const el2 = document.createElement("span");

			el1.appendChild(document.createTextNode("Ooh, look: "));

			el2.setAttribute(
				"style",
				"font-style: italic; background-color: red; color: black; background-color: AccentColor; color: AccentColorText;"
			);
			el2.innerText = "colour";

			el1.appendChild(el2);

			el1.appendChild(document.createTextNode("!"));

			return el1;
		}
		case 4:
			return "6*9+6+9=8.30662386292²";
		case 5: {
			const a = document.createElement("a");
			a.innerText = "| ||\n|| |_";
			a.setAttribute("href", "https://cad-comic.com/comic/loss/");
			a.setAttribute("target", "_blank");
			a.setAttribute("rel", "noopener noreferrer");
			a.style.color = "currentColor";
			a.style.textDecoration = "none";
			return a;
		}
		default:
			return "Beans";
	}
}

(
	document.getElementById("create-notification-button") as HTMLButtonElement
).addEventListener("click", () => {
	createNotification(getRandomMessage(), {
		autoDismissTimeout: autoDismissCheckbox.checked ? 3200 : 0,
		dismissible: dismissButtonCheckbox.checked,
		animated: animateCheckbox.checked,
	});
});

(
	document.getElementById("dismiss-all-button") as HTMLButtonElement
).addEventListener("click", dismissAllNotifications);
