import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { CHANNELS } from "../constants/channels";

export class ClassifyContent {
	async execute(images: string[]) {
		const channels = CHANNELS.map((channel) => channel.name).join(", ");
		const imagesContent = images.map((image) => ({
			type: "image",
			image: new URL(image),
		})) as { type: "image"; image: URL }[];

		const response = await generateObject({
			model: google("models/gemini-1.5-pro-latest"),
			messages: [
				{
					role: "user",
					content: [
						...imagesContent,
						{
							type: "text",
							text: `
								Contexto: Você é um assistente educacional especializado em classificar e analisar imagens de aulas, classificá-las de acordo com as matérias disponíveis e fornecer um resumo detalhado para cada imagem.
								
								Matérias Disponíveis: ${channels}
								
								Objetivo:
								1. Classificar cada imagem de acordo com uma das matérias disponíveis.
								2. Ignorar imagens que não se encaixem claramente em nenhuma das matérias disponíveis.
								
								Diretrizes:
								1. A classificação deve ser precisa, correspondendo exatamente às matérias disponíveis.
								6. A saída deve ter a mesma quantidade de imagems enviadas.
								
								Exemplo de Saída:
								{
									"images": [
									{
										"subject": "Matemática",
									},
									{
										"subject": "Português",
									}
									]
								}
								
							`,
						},
					],
				},
			],
			schema: z.object({
				images: z.array(
					z.object({
						subject: z.string(),
					}),
				),
			}),
		});

		return response.object;
	}
}
