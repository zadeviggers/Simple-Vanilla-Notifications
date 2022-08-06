import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
export default defineConfig({
	plugins: [
		dts({
			entryRoot: "lib",
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			name: "Simple Vanilla Notifications",
			fileName: "simple-vanilla-notifications",
		},
	},
});
