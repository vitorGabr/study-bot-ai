import sharp from "sharp";
import { type GenerativeIa, type ContentProps, type ModelsOptions, anthropicModels } from "../../interfaces/generative-ia";
import Anthropic from "@anthropic-ai/sdk";
import {  parse } from "valibot";

export class AnthropicAI extends Anthropic implements GenerativeIa {
	readonly name = "Anthropic Claude";

	constructor() {
		super({
			apiKey: `${process.env.ANTHROPIC_API_KEY}`,
		});
	}

	createModel(options: ModelsOptions) {
		const option = parse(anthropicModels, options)
		return {
			generateContent: (props: ContentProps) =>
				this.generate(option, props),
		};
	}

	private async generate(model: string, prompt: ContentProps) {
		const content = await Promise.all(
			prompt.map(async ({ content, type }) => {
				if (type === "url") {
					const dataBase64 = await this.urlToBase64(content);
					return {
						type: "image",
						source: {
							type: "base64",
							media_type: "image/jpeg",
							data: dataBase64,
						},
					} as Anthropic.Messages.ImageBlockParam
				}

				return {
					type: "text",
					text: content
				} as Anthropic.Messages.TextBlockParam;
			}),
		);
		const msg = await this.messages.create({
			model,
			max_tokens: 1024,
			messages: [{ role: "user", content }],
		});

		const response = msg.content;
		return response.map((item) => item.text).join("\n");
	}

	private async urlToBase64(url: string) {
		return fetch(url)
			.then((response) => response.blob())
			.then(async (blob) => {
				const buf = await blob.arrayBuffer();
				const nodeBuffer = Buffer.from(buf);
				let bufferImgCompressed = await sharp(nodeBuffer)
					.jpeg({ quality: 70 })
					.resize({ width: 800, height: 800 })
					.toBuffer()
					.then(data => { return data; })
					.catch(err => { console.log('Error on compress'); });

				if (!bufferImgCompressed) return;
				return bufferImgCompressed.toString('base64');
			});
	}
}
