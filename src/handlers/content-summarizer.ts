import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export class ContentSummarizer {
	async execute({}:{
		subject: string;
		images: string;
	}) {
		const response = await generateObject({
			model: google("models/gemini-1.5-pro-latest"),
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text: `
								Contexto: Você é um assistente educacional especializado em resumir e organizar conteúdo de aulas. Sua tarefa é analisar imagens de aulas recentes e criar um resumo detalhado pela matéria.
								Dados de Entrada: 
									Matéria - 
								Objetivo: 
								1. Crie um resumo detalhado e coerente do conteúdo da aula.
								3. Organize as informações de forma lógica e fácil de entender.

								Diretrizes:
								1. O resumo deve ser detalhado, mas conciso, destacando os pontos-chave da aula.
								2. Use linguagem clara e apropriada para o nível educacional dos estudantes.
								3. Se possível, inclua exemplos ou exercícios mencionados nas imagens.
								4. Indique qualquer sequência lógica ou progressão do conteúdo, se aplicável.

								Formato de Saída:
								{
									"content": [
										{
										"subject": "Nome da Matéria",
										"resume": "Resumo detalhado da aula, incluindo tópicos principais, conceitos-chave e exemplos relevantes."
										},
									]
								}
								Por favor, processe as informações fornecidas e gere um resumo estruturado seguindo estas diretrizes.
							`,
						},
					],
				},
			],
			schema: z.object({
				content: z.object({
					subject: z.string(),
					resume: z.string(),
				}),
			}),
		});

		return response.object;
	}
}
