import { ChannelType, EmbedBuilder } from "discord.js";
import { CHANNELS } from "../settings/constants/channels";
import { ERRORS } from "../settings/constants/errors";
import { SumarizeDay } from "../handlers/summarize-day";
import { SummarizeImagesContent } from "../handlers/summarize-images-content";
import dayjs from "dayjs";
import { Event } from "../structures/main/event";
import { GeminiIa } from "../structures/ai/gemini";

const ia = new GeminiIa();

export default new Event({
	name: "messageCreate",
	run: async (message) => {
		const { author, attachments, guild } = message;

		if (attachments.size <= 0 || author.bot) return;

		const images = attachments.map((attachment) => attachment.url);
		const contents = await new SummarizeImagesContent(ia).execute(images);

		for (const item of contents) {
			const { subject, content } = item;
			const contentsText = content.map((c) => c.content)
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

			const generatedClass = await new SumarizeDay(ia).execute(contentsText);

			if (channel?.type === ChannelType.GuildText) {
				const date = dayjs().subtract(1, "day").format("DD/MM/YYYY");

				const embed = new EmbedBuilder()
					.setTitle(`Aula gerada do dia ${date}`)
					.setDescription(generatedClass)
					.setTimestamp()
					.setColor('Random')
					.setFooter({
						text: `Gerado por ${ia.name}`,
					});
					let embed4 = new EmbedBuilder().setURL('https://astrixbot.cf').setImage('https://someimagelink.jpg')
				await channel.send({
					embeds: [embed,embed4],
					files: content.map((c) => c.image),
				});
			}
		}

		await message.delete();
	},
});
