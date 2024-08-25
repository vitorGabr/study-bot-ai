import { Event } from "../structures/event";

export default new Event({
	name: "ready",
	once: true,
	run: async (client) => {
		console.log(`Logged in as ${client.user?.tag}`);
	},
});
