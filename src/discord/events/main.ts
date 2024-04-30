import { ChannelType, type Channel } from "discord.js";
import { CHANNELS } from "../../settings/constants/channels";
import { ERRORS } from "../../settings/constants/errors";
import { summarizeDay } from "../../functions/summarize-day";
import { summarizeImagesContent } from "../../functions/summarize-images-content";
import { Event } from "../base/event";
import dayjs from "dayjs";

export default new Event({
    name: "messageCreate",
    run: async (message) => {
        if (message.author.bot) return;

        const images = message.attachments.map((attachment) => attachment.url);
        if (images.length === 0) {
            console.error(ERRORS.NO_IMAGE_FOUND);
            return;
        }

        await message.channel.sendTyping();

        const content = await summarizeImagesContent(images);

		if (content.images.length === 0) {
			await message.reply(ERRORS.NO_IMAGE_FOUND);
			return;
		}
		const uniqueSubjects = [
			...new Set(content.images.map((image) => image.subject)),
		];
		for (const subject of uniqueSubjects) {
			const subjects = content.images.filter(
				(image) => image.subject === subject,
			);
			const generatedClass = await summarizeDay(subjects);

			const channelInfo = CHANNELS.find((channel) => {
				return (
					channel.name === subject || channel.optionalNames?.includes(subject)
				);
			});

			if (!channelInfo) {
				await message.reply(
					`${ERRORS.CHANNEL_NOT_FOUND}, ${subject} não encontrado!`,
				);
				continue;
			}

			let channel: Channel | undefined = message.guild?.channels.cache.find(
				(channel) => channel.name === channelInfo.tag,
			)

			if (!channel) {
				channel = message.client.channels.cache.get(
                    message.channel.id
                );
                if (!channel) {
                    await message.reply(ERRORS.CHANNEL_NOT_FOUND);
                    continue;
                }
			}

			if (channel?.type === ChannelType.GuildText) {
				const date = dayjs().subtract(1, "day").format("DD/MM/YYYY");
				const topic = await channel.threads.create({
					name: `Aula gerada do dia ${date}`,
				});
				await topic.send({
					content: generatedClass.text,
					files: generatedClass.content.map((content) => content.image),
				});
			}
		}

		await message.delete();
    }
})