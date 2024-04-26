import {
	Client,
	IntentsBitField,
	Partials,
	type BitFieldResolvable,
	type GatewayIntentsString,
} from "discord.js";

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
});

client.login(process.env.DISCORD_BOT_TOKEN);

export {client};
