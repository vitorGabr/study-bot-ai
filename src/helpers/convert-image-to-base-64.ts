import sharp from "sharp";

export async function convertImageToBase64(url: string) {
    return fetch(url)
    .then((response) => response.blob())
    .then(async (blob) => {
        const buf = await blob.arrayBuffer();
        const nodeBuffer = Buffer.from(buf);
        let bufferImgCompressed = await sharp(nodeBuffer)
            .jpeg({ quality: 70 })
            .resize({ width: 800, height: 800 })
            .toBuffer()
            .then(data => { return data; })

        if (!bufferImgCompressed) return '';
        return bufferImgCompressed.toString('base64');
    });
}