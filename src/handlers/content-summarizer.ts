import { CHANNELS } from "../constants/channels";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export class ContentSummarizer {
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
							text: `Dados: "As matérias disponíveis são: ${channels}."`
						},
						{
							type: "text",
							text: `
								Objetivo: "
                                    1. Dada a sequência de imagens organizar por index, (0,1,2)
									2. Dada a uma sequência de imagens, agrupar por matéria e gerar um resumo detalhado para cada uma, 
										o objetivo é identificar o conteúdo passado em sala de aula de cada matéria.
										O resumo deve ser bem organizado e detalhado, com informações relevantes que ajudem a entender o conteúdo.
										Agrupar por cada matéria e resumo um array de imagens que representam o conteúdo com o index que foi gerado de cada imagem,
										por exemplo, a matéria de matemática tem 3 imagens, então o index será (0,1,2) e assim por diante.
									3. Caso o conteúdo não esteja presente em nenhuma matéria, ele deve ser incluido em Outros explicando detalhadamente sobre o assunto.
								",
								Observação: "
									- O resumo deve ser bem detalhado e organizado, com informações relevantes que ajudem a entender o conteúdo.
									- Geralmente o conteúdo é passado em sequência de imagems da aula do dia anterior.
								"
							`,
						},
					],
				},
			],
			schema: z.object({
				imagesIndex: z.array(z.coerce.number()),
				subjects: z.array(
					z.object({
						subject: z.string(),
						resume: z.string(),
						imagesIndex: z.array(z.coerce.number()),
					}),
				),
			}),
		});
		return response.object;
	}
}
