import { array, object, optional, parse, string } from "valibot";
import { CHANNELS } from "../settings/constants/channels";
import type { GenerativeIa } from "../interfaces/generative-ia";
import dayjs from "dayjs";

const responseSchema = object({
	images: array(
		object({
			image: optional(string(), ""),
			subject: string(),
			content: string(),
		}),
	),
});

export class SummarizeImagesContent {
	constructor(private ia: GenerativeIa) {}

	async execute(images: string[]) {
		const weekDay = dayjs().subtract(1, "day").day();
		const model = this.ia.createModel("gemini-pro-vision");
		const channels = CHANNELS.filter((channel) =>
			channel.classDays.includes(weekDay),
		)
			.map((channel) => channel.name)
			.join(", ");

		const prompt = `
            "Objetivo": "Identificar com precisão a matéria e gerar conteúdo detalhado para imagens fornecidas.",
            "Dados": "As matérias disponíveis são: ${channels}.",
            "Resposta": "Retorne em formato de texto: { "images": [{ "subject": string, "content": string }] }",
            "Atenção": [
                "- Certifique-se de que a identificação da matéria seja precisa e restrita às opções fornecidas nos 'Dados'.",
                "- O conteúdo gerado deve ser detalhado, refletindo fielmente o que é apresentado na imagem e incluindo informações relevantes para a matéria identificada.",
                "- Utilize conhecimento adicional relacionado ao tema para enriquecer o conteúdo, mantendo a precisão e a relevância.",
                "- Evite generalizações ou informações não relacionadas ao tema específico identificado na imagem.",
                "- Verifique cuidadosamente a correspondência entre a matéria identificada e o conteúdo gerado, garantindo que ambos estejam alinhados de forma precisa e clara.",
                "- O nome da matéria deve ser uma dessas: [${channels}]. Qualquer outro nome será considerado inválido."
                "- Deve ser gerado um resumo para cada imagem fornecida, com a matéria identificada e o conteúdo detalhado correspondente."
                "- Não pode haver erros na identificação da matéria ou no conteúdo gerado."
                "- Matérias que não estejam na lista fornecida serão consideradas inválidas."
            ]
        `;

		const imagesData = images.map((image) => ({
			content: image,
			type: "url",
		})) as { content: string; type: "url" }[];

		const response = await model.generateContent([
			{
				content: prompt,
				type: "text",
			},
			...imagesData,
		]);

		try {
			const jData = JSON.parse(response.replace(/[`]/g, ""));
			const content = parse(responseSchema, jData);

			content.images = content.images.map((contentImage, index) => ({
				...contentImage,
				image: images[index],
			}));

			const uniqueSubjects = [
				...new Set(content.images.map((image) => image.subject)),
			];
			return uniqueSubjects.map((subject) => ({
				subject,
				content: content.images.filter((image) => image.subject === subject),
			}));
		} catch (error) {
			console.error(error);
			return [];
		}
	}
}
