import { ValiError, array, flatten, object, optional, parse, string } from "valibot";
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
		const channels = CHANNELS.map((channel) => channel.name)
			.join(", ");

		const prompt = `
			{
				"Objetivo": "Identificar com precisão a matéria e gerar conteúdo detalhado para imagens fornecidas.",
				"Dados": "As matérias disponíveis são: ${channels}.",
				"Resposta": {
					"type": "object",
					"properties": {
						"images": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"subject": {"type": "string"},
									"content": {"type": "string"}
								},
								"required": ["subject", "content"]
							}
						}
					},
					"required": ["images"]
				},
				"Atenção": [
					"- Garanta que a identificação da matéria seja precisa e restrita às opções fornecidas nos 'Dados'.",
					"- O conteúdo gerado deve ser detalhado, fiel ao que é apresentado na imagem e incluir informações relevantes para a matéria identificada.",
					"- Utilize conhecimento adicional relacionado ao tema para enriquecer o conteúdo, mantendo a precisão e relevância.",
					"- Evite generalizações ou informações não pertinentes ao tema específico identificado na imagem.",
					"- Verifique cuidadosamente a correspondência entre a matéria identificada e o conteúdo gerado, assegurando alinhamento preciso e clareza.",
					"- O nome da matéria deve ser uma das opções fornecidas em '${channels}'. Outros nomes serão considerados inválidos.",
					"- Deve ser gerado um resumo para cada imagem fornecida, com a matéria identificada e o conteúdo detalhado correspondente.",
					"- Evite ambiguidades na identificação da matéria ou no conteúdo gerado.",
					"- Processar cada imagem individualmente para evitar erros de associação entre matéria e conteúdo.",
					"- Se a imagem não corresponder a nenhuma matéria, utilize o nome 'Outros' para a matéria identificada e mantenha a estrutura definida.",
					"- Em casos de imagens com múltiplos temas ou assuntos, priorize a identificação do tema principal ou dominante, mantendo fidelidade às regras de precisão e relevância."
				]
			}
		
        `;


		try {
			const model = this.ia.createModel("gemini-pro-vision");
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
			if(error instanceof ValiError) {
				const flattenErrors = flatten<typeof responseSchema>(error);
				console.error(flattenErrors);
			}
			
			return [];
		}
	}
}
