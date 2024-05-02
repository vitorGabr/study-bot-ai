import { type GenerativeIa, type ContentProps, type ModelsOptions, anthropicModels } from "../../interfaces/generative-ia";
import Anthropic from "@anthropic-ai/sdk";
import {  parse } from "valibot";
import { convertImageToBase64 } from "../../helpers/convert-image-to-base-64";

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
					const dataBase64 = await convertImageToBase64(content);
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

}
