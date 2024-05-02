import {
	type GenerativeModel,
	GoogleGenerativeAI,
} from "@google/generative-ai";
import { type GenerativeIa, type ContentProps, type ModelsOptions, geminiModels } from "../../interfaces/generative-ia";
import { parse } from "valibot";
import { convertImageToBase64 } from "../../helpers/convert-image-to-base-64";

export class GeminiIa extends GoogleGenerativeAI implements GenerativeIa {
	readonly name = "Gemini";

	constructor() {
		super(`${process.env.GOOGLE_API_KEY}`);
	}

	createModel(options: ModelsOptions) {
		const option = parse(geminiModels, options)
		const clientModel = this.getGenerativeModel({ model: option });

		return {
			generateContent: (props: ContentProps) =>
				this.generate(clientModel, props),
		};
	}

	private async generate(model: GenerativeModel, prompt: ContentProps) {
		const content = await Promise.all(
			prompt.map(async ({ content, type }) => {
				if (type === "url") {
					return {
						inlineData: {
							data: await convertImageToBase64(content),
							mimeType: "image/jpeg",
						},
					};
				}

				return content;
			}),
		);

		const result = await model.generateContent(content);
		const response = await result.response;
		return response.text();
	}
}
