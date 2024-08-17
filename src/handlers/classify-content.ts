import { CHANNELS } from "../constants/channels";
import { google } from "@ai-sdk/google";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { z } from "zod";

export class ClassifyContent {
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
                        text: `
                            Contexto: Você é um assistente educacional especializado em classificar e resumir conteúdo de aulas. Sua tarefa é analisar imagens de aulas, classificá-las de acordo com as matérias disponíveis e fornecer um resumo detalhado para cada imagem.
                            
                            Matérias Disponíveis: ${channels}
                            
                            Objetivo:
                            1. Classificar cada imagem de acordo com uma das matérias disponíveis.
                            2. Fornecer um resumo detalhado e organizado para cada imagem classificada.
                            3. Ignorar imagens que não se encaixem claramente em nenhuma das matérias disponíveis.
                            
                            Diretrizes:
                            1. A classificação deve ser precisa, correspondendo exatamente às matérias disponíveis.
                            2. O resumo deve ser detalhado, destacando os pontos-chave do conteúdo da imagem.
                            3. Use linguagem clara e apropriada para o nível educacional dos estudantes.
                            4. Se possível, inclua exemplos ou exercícios mencionados nas imagens.
                            5. Organize as informações de forma lógica e fácil de entender.
                            6. A saída deve ter a mesma quantidade de imagems enviadas.
                            
                            Exemplo de Saída:
                            {
                                "images": [
                                {
                                    "subject": "Matemática",
                                    "resume": "A imagem apresenta uma aula sobre equações quadráticas. O professor demonstrou a fórmula geral (-b ± √(b² - 4ac)) / (2a) e resolveu dois exemplos práticos, enfatizando a importância de identificar os coeficientes a, b e c."
                                },
                                {
                                    "subject": "Português",
                                    "resume": "Esta imagem mostra uma análise sintática de períodos compostos. O foco estava na identificação de orações coordenadas e subordinadas, com exemplos de conjunções coordenativas (e, mas, ou) e subordinativas (que, se, quando)."
                                }
                                ]
                            }
                            
                            Por favor, processe as informações fornecidas e gere um resumo classificado seguindo estas diretrizes.
                        `,
                      },
                    ],
                  },
                ],
                schema: z.object({
                  images: z.array(
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
