import {
	type GenerativeModel,
	GoogleGenerativeAI,
} from "@google/generative-ai";
import type { ContentProps, GenerativeIa } from "./types/generative-ia";

export class GeminiIa extends GoogleGenerativeAI implements GenerativeIa {
	readonly name = "Gemini";

	constructor() {
		super(`${process.env.GOOGLE_API_KEY}`);
	}

	createModel(model: string) {
		const clientModel = this.getGenerativeModel({ model });

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
							data: await this.urlToBase64(content),
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

	private async urlToBase64(url: string) {
		return fetch(url)
			.then((response) => response.blob())
			.then(async (blob) => {
				const buf = await blob.arrayBuffer();
				const base64 = Buffer.from(buf).toString("base64");
				return base64;
			});
	}
}
