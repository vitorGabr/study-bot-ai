export type ContentProps = {
    content: string;
    type: "text" | "url";
}[];

export interface GenerativeIa {
    name: string;
    createModel: (model:string) => {
        generateContent: (props: ContentProps) => Promise<string>;
    };
}
