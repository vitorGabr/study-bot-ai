import { object, optional, picklist, union, type Output } from "valibot";

export const anthropicModels = picklist(["claude-3-opus-20240229"]);
export const geminiModels = picklist(["gemini-pro-vision","gemini-pro"]);

export const modelsOptions = union([anthropicModels, geminiModels]);

export type ModelsOptions = Output<typeof modelsOptions>;

export type ContentProps = {
    content: string;
    type: "text" | "url";
}[];

export interface GenerativeIa {
    name: string;
    createModel: (model: ModelsOptions) => {
        generateContent: (props: ContentProps) => Promise<string>;
    };
}
