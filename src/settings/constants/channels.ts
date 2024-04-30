type ChannelProps = {
	id: string;
	name: string;
	tag: string;
	optionalNames?: string[];
};

export const CHANNELS = [
	{
		name: "Linguagens Formais e Autômatos",
		tag: "linguagens-formais-e-automatos",
		optionalNames: ["Autômatos"],
	},
	{
		name: "Arquitetura de Computadores Modernos",
		tag: "arquitetura-de-computadores-modernos",
	},
	{
		name: "Sistemas Operacionais",
		tag: "sistemas-operacionais",
	},
	{
		name: "Inteligência Artificial",
		tag: "inteligencia-artificial",
	},
	{
		name: "Computação Gráfica",
		tag: "computacao-grafica",
	},
	{
		name: "Arquitetura de Redes de Computador",
		tag: "arquitetura-de-redes-de-computador",
	}
] as ChannelProps[];
