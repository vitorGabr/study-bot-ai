export const urlToBase64 = async (url: string) => {
	return fetch(url)
		.then((response) => response.blob())
		.then(async (blob) => {
			const buf = await blob.arrayBuffer();
			const base64 = Buffer.from(buf).toString("base64");
			return base64;
		});
};