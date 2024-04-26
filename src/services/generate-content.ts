import { parse } from "valibot";
import { CHANNELS } from "../constants/channels";
import { genAI } from "../lib/ai";
import { urlToBase64 } from "../utils/url-base64";
import {
	ResponseContentSchema,
	type ResponseContent,
} from "../structs/image-content";

const prompt = `
    "Objetivo": "Identificar com precisão a matéria e gerar conteúdo detalhado para imagens fornecidas.",
    "Dados": "As matérias disponíveis são: ${CHANNELS.map(
			(channel) => channel.name,
		).join(", ")}.",
    "Resposta": "Retorne em formato de texto: { "images": { "subject": string, "content": string }[] }",
    "Atenção": [
    "- Certifique-se de que a identificação da matéria seja precisa e restrita às opções fornecidas nos 'Dados'.",
    "- O conteúdo gerado deve ser detalhado, refletindo fielmente o que é apresentado na imagem e incluindo informações relevantes para a matéria identificada.",
    "- Utilize conhecimento adicional relacionado ao tema para enriquecer o conteúdo, mantendo a precisão e a relevância.",
    "- Evite generalizações ou informações não relacionadas ao tema específico identificado na imagem.",
    "- Verifique cuidadosamente a correspondência entre a matéria identificada e o conteúdo gerado, garantindo que ambos estejam alinhados de forma precisa e clara."
    " - O nome da matéria deve ser uma dessas [${CHANNELS.map(
			(channel) => channel.name,
		).join(", ")}]."
`;

export async function generateContent(
	images: string[],
): Promise<ResponseContent> {
	const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

	const imagesData = await Promise.all(
		images.map(async (image) => {
			return {
				inlineData: {
					data: await urlToBase64(image),
					mimeType: "image/jpeg",
				},
			};
		}),
	);

	const result = await model.generateContent([prompt, ...imagesData]);

	const response = await result.response;
	const text = response.text();

	try {
		const jData = JSON.parse(text.replaceAll("`", ""));
		const content = parse(ResponseContentSchema, jData);

		content.images = content.images.map((contentImage, index) => {
			return {
				...contentImage,
				image: images[index],
			};
		});

		return content;
	} catch (error) {
		return {
			images: [],
		};
	}
}
