import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

console.log(process.env.BUILD_DEMO);
const buildLibrary = process.env.BUILD_DEMO ? false : true;

export default defineConfig({
	plugins: [
		buildLibrary &&
			dts({
				entryRoot: "lib",
			}),
	],
	build: buildLibrary && {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			name: "Simple Vanilla Notifications",
			fileName: "simple-vanilla-notifications",
		},
	},
});
