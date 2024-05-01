import type { GenerativeIa } from "../structs/types/generative-ia";
import { SumarizeDay } from "./summarize-day";
import { SummarizeImagesContent } from "./summarize-images-content";

export class HandleImages {
    constructor(private ia: GenerativeIa) {
        this.ia = ia;
    }
    async execute(images:string[]) {
        const subjects = await new SummarizeImagesContent(this.ia).execute(images);
        if (subjects.length === 0) {
            return [];
        }
        const results = [];
        for (const item of subjects) {
            const { subject, content } = item;
            const generatedClass = await new SumarizeDay(this.ia).execute(content.map((c) => c.content));
            results.push({ 
                subject, 
                content: generatedClass,
                images: content.map((c) => c.image)
             });
        }
        return results;
    }
}