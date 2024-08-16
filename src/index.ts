import { Core } from "./structures/main/core";

const client = new Core();
client.start();

Bun.serve({
	port: 3000,
	fetch(request) {
		return new Response("Welcome to Bun!");
	},
});

export { client };
