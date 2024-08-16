type ChannelProps = {
	id: string;
	name: string;
	tag: string;
};

export const CHANNELS = [
	{
		name: "Cáuculo numérico computacional",	
		tag: "calculo-numerico-computacional",
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
		name: "Processamento de Imagens e visão computacional",
		tag: "processamento-de-imagens-e-visao-computacional",
	},
	{
		name: "Outros",
		tag: "outros",
	}
] as ChannelProps[];
