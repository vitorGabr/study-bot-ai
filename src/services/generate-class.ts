import { genAI } from "../lib/ai";
import type { ImageContent } from "../structs/image-content";

type ContentProps = ImageContent[];

export async function generateClass(data: ContentProps) {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const prompt = `
		"Objetivo: Dado varios resumos de conteudo de uma materia, gerar um resumo da aula no dia.",
		"Dados: "Os resumos disponíveis são: ${data
			.map(({ content }) => content)
			.join(", ")}.",
		"Resposta: "Retorne em formato de texto.",
		"Atenção: [
			"- A resposta tem que começar assim 'A aula de hoje foi sobre: '",
			"- Utilize conhecimento adicional relacionado ao tema para enriquecer o resumo, mantendo a precisão e a relevância.",
		]
	`;
	const result = await model.generateContent([prompt]);

	const response = await result.response;
	return {
		content:data,
		text: response.text(),
	};
}
