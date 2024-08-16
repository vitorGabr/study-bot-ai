import { CHANNELS } from "../constants/channels";
import { google } from "@ai-sdk/google";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { z } from "zod";

export class ContentSummarizer {
	async execute(images: string[]) {
		const channels = CHANNELS.map((channel) => channel.name).join(", ");
		const imagesContent = images.map((image) => ({
			type: "image",
			image: new URL(image),
		})) as { type: "image"; image: URL }[];

		try {
			const response = await generateObject({
				model: google("models/gemini-1.5-pro-latest"),
				messages: [
					{
						role: "user",
						content: [
							...imagesContent,
							{
								type: "text",
								text: `Dados: "As matérias disponíveis são: ${channels}."`,
							},
							{
								type: "text",
								text: `
									Objetivo:
									1. Organize a sequência de imagens de acordo com seu índice. O índice máximo permitido é o tamanho total da sequência de imagens.
									   Qualquer valor fora do intervalo (0 a ${images.length}) deve ser ignorado.
								`,
							},
							{
								type: "text",
								text: `
									Objetivo:
									1. Agrupe as imagens por matéria e gere um resumo detalhado para cada grupo, focado em identificar o conteúdo abordado em sala de aula.
									   O resumo deve incluir:
										 - Tópicos principais abordados.
										 - Exemplos ou detalhes específicos mostrados nas imagens.
										 - Conexões entre os tópicos e as imagens.
									   O resumo deve ser bem organizado e conter informações relevantes que ajudem a compreender o conteúdo.
									   Para cada matéria identificada, inclua todos os índices das imagens relacionadas. 
									   Essa etapa é crucial para garantir a precisão do resumo. Qualquer erro na associação de imagens invalidará todo o conteúdo,
									   portanto, muita atenção é necessária.
									2. Apenas as matérias listadas devem ser reconhecidas.
									3. Os índices das imagens são baseados na sequência passada, começando do índice 0.
									4. Não deve haver repetição de matérias. Se uma matéria, como matemática, já foi identificada, ela não deve aparecer novamente.
									   Cada matéria deve ser única e as imagens associadas devem estar agrupadas no campo 'imageIndexes'.
								`,
							},
							{
								type: "text",
								text: `
									Observações:
									- O resumo deve ser detalhado e organizado, com informações que facilitem a compreensão do conteúdo.
									- Normalmente, o conteúdo é apresentado em uma sequência de imagens da aula do dia anterior.
									- As matérias identificadas devem coincidir exatamente com as disponíveis e com o tema abordado nas imagens.
									- Se houver incerteza sobre a matéria correspondente a uma imagem, essa imagem deve ser ignorada.
									- Somente inclua no resumo matérias que possam ser identificadas com certeza a partir das imagens.
								`,
							},
							{
								type: "text",
								text: `
									Exemplo de Saída:
									- Matéria: Matemática
									  Resumo: "A aula cobriu os conceitos de álgebra, incluindo equações lineares e quadráticas. As imagens mostraram exemplos de problemas resolvidos em sala."
									  Índices de Imagens: [0, 1, 2]
									- Matéria: História
									  Resumo: "A aula discutiu os principais eventos da Revolução Francesa, destacando as causas e consequências do movimento."
									  Índices de Imagens: [3, 4, 5]
								`,
							},
						],
					},
				],
				schema: z.object({
					subjects: z.array(
						z.object({
							subject: z.string(),
							resume: z.string(),
							imageIndexes: z.array(z.coerce.number()),
						}),
					),
				}),
			});

			return response.object;
		} catch (error) {
			if (TypeValidationError.isInstance(error)) {
				console.log({ type: "validation-error", value: error.value });
			} else if (JSONParseError.isInstance(error)) {
				console.log({ type: "parse-error", text: error.text });
			} else {
				console.log({ type: "unknown-error", error });
			}
			return null;
		}
	}
}
