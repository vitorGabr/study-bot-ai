import { ChannelType } from "discord.js";
import { generateContent } from "./services/generate-content";
import { CHANNELS } from "./constants/channels";
import { generateClass } from "./services/generate-class";
import { client } from "./lib/discord";
import { ERRORS } from "./constants/errors";
import dayjs from "dayjs";

client.on("ready", () => {
	console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	const images = message.attachments.map((attachment) => attachment.url);

	if (images.length === 0) {
		console.error(ERRORS.NO_IMAGE_FOUND);
		return;
	}

	await message.channel.sendTyping();

	generateContent(images).then(async (content) => {
		if (content.images.length === 0) {
			message.reply(ERRORS.NO_IMAGE_FOUND);
			return;
		}
		const unique = new Set(content.images.map((image) => image.subject));

		for (const item of unique) {
			const subjects = content.images.filter(
				(image) => image.subject === item,
			);

			const generate = await generateClass(subjects);

			const findChannel = CHANNELS.find((channel) => {
				return channel.name === item || channel.optionalNames?.includes(item);
			});

			if (!findChannel) {
				message.reply(ERRORS.CHANNEL_NOT_FOUND);
				return;
			}

			const channel = client.channels.cache.get(findChannel?.id);

			if (!channel) return console.error(ERRORS.CHANNEL_NOT_FOUND);

			if (channel.type === ChannelType.GuildText) {
				const date = dayjs().subtract(1, "day").format("DD/MM/YYYY");
				const topic = await channel.threads.create({
					name: `Aula gerada do dia ${date}`,
				});
				await topic.send({
					files: [...generate.content.map((content) => content.image)],
					content: generate.text,
				});
			}
		}
		await message.delete();
	});
});

export { client };
