export type ContentProps = {
    content: string;
    type: "text" | "url";
}[];

export interface GenerativeIa {
    createModel: (model:string) => {
        generateContent: (props: ContentProps) => Promise<string>;
    };
}
