import {
	Client,
	IntentsBitField,
	Partials,
	type BitFieldResolvable,
	type ClientOptions,
	type GatewayIntentsString,
} from "discord.js";
import { events } from "../events";

type CreateClientReturnType = Client & Partial<{ start: () => Promise<void> }>;

export function createClient(options?: ClientOptions) {
	const client = new Client({
		intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
			GatewayIntentsString,
			number
		>,
		partials: [
			Partials.Message,
			Partials.Channel,
			Partials.GuildMember,
			Partials.User,
		],
		...options,
	}) as CreateClientReturnType;

	client.start = async function () {
		for (const event of events) {
			try {
				if (event.name)
					event.once
						? client.once(event.name, event.run)
						: client.on(event.name, event.run);
			} catch (error) {
				console.error(error);
			}
		}

		this.login(process.env.DISCORD_TOKEN);
	};

    return client;
}
