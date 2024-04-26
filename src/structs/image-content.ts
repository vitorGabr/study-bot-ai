import { array, object, optional, string, type Output } from 'valibot';

export const ImageContentSchema = object({
    image: optional(string(),''),
    subject: string(),
    content: string(),
});

export const ResponseContentSchema = object({
    images: array(ImageContentSchema),
});

export type ResponseContent = Output<typeof ResponseContentSchema>;
export type ImageContent = Output<typeof ImageContentSchema>;


