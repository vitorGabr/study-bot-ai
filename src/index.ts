import { Core } from "./structures/main/core";

const client = new Core();
client.start();

const server = Bun.serve({
	port: 8080,
	fetch(req) {
		return new Response("404!");
	},
});

console.log(`${server.url} is running!`);

export { client };
