import { geminiAI } from "../settings/ia/gemini";
import type { ImageContent } from "../settings/schemas/image-content";

/**
 * Gera uma aula com base em resumos de conteúdo de imagens.
 * @param {ImageContent[]} data - Array de objetos ImageContent contendo resumos de conteúdo de imagens.
 * @returns {Promise<{ content: ImageContent[], text: string }>} - Objeto contendo o conteúdo das imagens e o texto gerado da aula.
 */
export async function summarizeDay(data: ImageContent[]) {
    const model = geminiAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        "Objetivo: Dado vários resumos de conteúdo de uma matéria, gerar um resumo da aula no dia.",
        "Dados: Os resumos disponíveis são: ${data.map(({ content }) => content).join(", ")}.",
        "Resposta: Retorne em formato de texto.",
        "Atenção: [
            "- A resposta tem que começar assim 'A aula de hoje foi sobre: '",
            "- Utilize conhecimento adicional relacionado ao tema para enriquecer o resumo, mantendo a precisão e a relevância."
        ]
    `;
    
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    
    return {
        content: data,
        text: response.text()
    };
}
