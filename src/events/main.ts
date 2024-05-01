import { ChannelType, EmbedBuilder } from "discord.js";
import { CHANNELS } from "../settings/constants/channels";
import { ERRORS } from "../settings/constants/errors";
import dayjs from "dayjs";
import { Event } from "../structs/types/event";
import { GeminiIa } from "../structs/gemini-ia";
import { HandleImages } from "../functions/handle-images";

const ia = new GeminiIa();

export default new Event({
	name: "messageCreate",
	run: async (message) => {
		const { author, attachments, channel, guild } = message;
		if (author.bot) return;
		const images = attachments.map((attachment) => attachment.url);
		if (images.length === 0) {
			console.error(ERRORS.NO_IMAGE_FOUND);
			return;
		}

		await channel.sendTyping();
		const contents = await new HandleImages(ia).execute(images);

		if (contents.length === 0) {
			await message.reply(ERRORS.NO_IMAGE_FOUND);
			return;
		}

		for (const item of contents) {
			const { subject, content, images } = item;

			const channelInfo = CHANNELS.find((channel) => channel.name === subject);
			const channel = guild?.channels.cache.find(
				(channel) => channel.name === channelInfo?.tag,
			);

			if (!channel) {
				await message.reply(
					`${ERRORS.CHANNEL_NOT_FOUND}, ${subject} não encontrado!`,
				);
				continue;
			}

			if (channel?.type === ChannelType.GuildText) {
				const date = dayjs().subtract(1, "day").format("DD/MM/YYYY");
				const randomColor = Math.floor(Math.random() * 16777215);

				const embed = new EmbedBuilder()
					.setTitle(`Aula gerada do dia ${date}`)
					.setDescription(content)
					.setTimestamp()
					.setColor(randomColor);

				for (const attachment of images) {
					embed.setImage(attachment);
				}

				await channel.send({
					embeds: [embed],
				});
			}
		}

		await message.delete();
	},
});
