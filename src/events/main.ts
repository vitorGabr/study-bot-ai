import { ChannelType, EmbedBuilder } from "discord.js";
import { CHANNELS } from "../constants/channels";
import { ERRORS } from "../constants/errors";
import { ContentSummarizer } from "../handlers/content-summarizer";
import dayjs from "dayjs";
import { Event } from "../structures/event";
import { ClassifyContent } from "../handlers/classify-content";

export default new Event({
	name: "messageCreate",
	run: async (message) => {
		const { author, attachments, guild, channel } = message;
		if (
			attachments.size === 0 ||
			author.bot
		) {
			return;
		}
		
		try {
			await message.channel.sendTyping();

			const imageUrls = Array.from(attachments.values()).map(
				(attachment) => attachment.url,
			);

			const classifiedImages = await new ClassifyContent().execute(imageUrls);
			if (!classifiedImages?.images.length) {
				await message.reply(ERRORS.NO_CONTENT_FOUND);
				return;
			}

			const content = await new ContentSummarizer().execute(
				classifiedImages.images,
			);

			if (!content?.subjects.length) {
				await message.reply(ERRORS.NO_CONTENT_FOUND);
				return;
			}

			const date = dayjs().subtract(1, "day").format("DD/MM/YYYY");

			for (const { subject, resume } of content.subjects) {
				const groupImages = classifiedImages.images
					.filter((item) => item.subject === subject)
					.map((_, index) => imageUrls[index])
					.filter(Boolean);

				const channelInfo = CHANNELS.find(
					(channel) => channel.name === subject,
				);
				const channel = guild?.channels.cache.find(
					(channel) => channel.name === channelInfo?.tag,
				);

				if (!channel) {
					await message.reply(
						`${ERRORS.CHANNEL_NOT_FOUND} ${subject} não encontrado!`,
					);
					continue;
				}

				if (channel.type !== ChannelType.GuildText) {
					console.error(`Canal ${subject} não é um canal de texto.`);
					continue;
				}

				const embed = new EmbedBuilder()
					.setTitle(`Aula gerada do dia ${date}`)
					.setDescription(resume)
					.setTimestamp()
					.setColor("Random");

				await channel.send({
					embeds: [embed],
					files: groupImages,
				});
			}

			await message.delete();
		} catch (error) {
			console.error("Erro ao processar mensagem:", error);
			await message.reply("ERROR");
		}
	},
});
