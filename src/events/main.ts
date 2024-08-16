import { ChannelType, EmbedBuilder } from "discord.js";
import { CHANNELS } from "../constants/channels";
import { ERRORS } from "../constants/errors";
import { ContentSummarizer } from "../handlers/content-summarizer";
import dayjs from "dayjs";
import { Event } from "../structures/main/event";

export default new Event({
	name: "messageCreate",
	run: async (message) => {
		const { author, attachments, guild } = message;

		if (attachments.size <= 0 || author.bot) return;

		await message.channel.sendTyping();
		const imageUrls = attachments.map((attachment) => attachment.url);
		const contents = await new ContentSummarizer().execute(imageUrls);

		for (const item of contents.subjects) {
			const { subject, resume, images } = item;
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

				const embed = new EmbedBuilder()
					.setTitle(`Aula gerada do dia ${date}`)
					.setDescription(resume)
					.setTimestamp()
					.setColor("Random");

				await channel.send({
					embeds: [embed],
					files: images.map((index) => imageUrls[index]),
				});
			}
		}

		await message.delete();
	},
});
