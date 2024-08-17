import { Glob } from "bun";
import {
	Client,
	GatewayIntentBits,
	Partials,
	type ClientEvents,
} from "discord.js";
import type { EventType } from "./event";

export class Core extends Client {
	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
			partials: [
				Partials.Message,
				Partials.Channel,
				Partials.GuildMember,
				Partials.User,
			],
		});
	}

	async start() {
		this.registerEvents();
		this.login(process.env.DISCORD_TOKEN);
	}

	private async registerEvents() {
		const glob = new Glob("**/*.ts");
		for await (const file of glob.scan({
			cwd: "./src/events",
		})) {
			const { name, once, run }: EventType<keyof ClientEvents> = (
				await import(`../events/${file}`)
			).default;
			try {
				if (name) once ? this.once(name, run) : this.on(name, run);
			} catch (error) {
				console.error(error);
			}
		}
	}
}
