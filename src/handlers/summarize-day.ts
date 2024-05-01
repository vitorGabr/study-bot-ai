import type { GenerativeIa } from "../interfaces/generative-ia";

export class SumarizeDay {
	constructor(private ia: GenerativeIa) {}

	async execute(contents: string[]) {
		const model = this.ia.createModel("gemini-pro");
		const prompt = `
			"Objetivo: Dado vários resumos de conteúdo de uma matéria, gerar um resumo da aula no dia.",
			"Dados: Os resumos disponíveis são: ${contents.join(", ")}.",
			"Resposta: Retorne em formato de texto.",
			"Atenção: [
				"- A resposta tem que começar assim 'A aula de hoje foi sobre: {COLOCAR MATERIA AQUI}'",
				"- Corpo da aula deve conter um resumo resumo da aula no dia.",
				"- O resumo deve ser fiel ao conteúdo fornecido. Evite adicionar informações não presentes nos resumos.",
				"- O resumo deve ser curto e objetivo, refletindo o conteúdo fornecido.",
			]
		`;
		const response = await model.generateContent([
			{
				content: prompt,
				type: "text",
			},
		]);
		return response;
	}
}
