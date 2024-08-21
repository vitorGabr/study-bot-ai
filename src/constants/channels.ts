type ChannelProps = {
	name: string;
	tag: string;
};

export const CHANNELS = [
	{
		name: "Cáuculo numérico",
		tag: "calculo-numerico",
	},
	{
		name: "Aspectos Teóricos da Computação",
		tag: "aspectos-teoricos-da-computacao",
	},
	{
		name: "Sistemas Operacionais abertos e mobile",
		tag: "sistemas-operacionais-abertos-e-mobile",
	},
	{
		name: "Gestão de Projetos",
		tag: "gestao-de-projetos",
	},
	{
		name: "Processamento de Imagens",
		tag: "processamento-de-imagens",
	},
	{
		name: "Outros",
		tag: "outros",
	},
] satisfies ChannelProps[];
