import { google } from "@ai-sdk/google";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { z } from "zod";

export class ContentSummarizer {
  async execute(
    images: { subject: string; resume: string }[]
  ) {
    try {
      const response = await generateObject({
        model: google("models/gemini-1.5-pro-latest"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
					Contexto: Você é um assistente educacional especializado em resumir e organizar conteúdo de aulas. Sua tarefa é analisar imagens de aulas recentes e criar um resumo detalhado por matéria.
					Dados de Entrada: 
					${images
					.map(({ subject, resume }, index) => `Imagem ${index + 1}: Matéria: ${subject}, Resumo: ${resume}`)
					.join("\n")}
					Objetivo: 
						1. Agrupe as imagens por matéria.
						2. Para cada matéria, crie um resumo detalhado e coerente do conteúdo da aula.
						3. Organize as informações de forma lógica e fácil de entender.

					Diretrizes:
						1. Foque apenas nas matérias que podem ser identificadas com certeza a partir das imagens fornecidas.
						2. Ignore imagens que não se encaixem claramente em uma matéria específica.
						3. Evite repetições de matérias.
						4. O resumo deve ser detalhado, mas conciso, destacando os pontos-chave da aula.
						5. Use linguagem clara e apropriada para o nível educacional dos estudantes.
						6. Se possível, inclua exemplos ou exercícios mencionados nas imagens.
						7. Indique qualquer sequência lógica ou progressão do conteúdo, se aplicável.

					Formato de Saída:
					{
						"subjects": [
							{
							"subject": "Nome da Matéria",
							"resume": "Resumo detalhado da aula, incluindo tópicos principais, conceitos-chave e exemplos relevantes."
							},
							// Repita para cada matéria identificada
						]
					}
					Por favor, processe as informações fornecidas e gere um resumo estruturado seguindo estas diretrizes.
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
            })
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