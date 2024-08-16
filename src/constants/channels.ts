type ChannelProps = {
	id: string;
	name: string;
	tag: string;
	classDays?: number[];
};

export const CHANNELS = [
	{
		name: "Linguagens Formais e Autômatos",
		tag: "linguagens-formais-e-automatos",
		classDays: [2],
	},
	{
		name: "Arquitetura de Computadores Modernos",
		tag: "arquitetura-de-computadores-modernos",
		classDays: [3],
	},
	{
		name: "Sistemas Operacionais",
		tag: "sistemas-operacionais",
		classDays: [1],
	},
	{
		name: "Inteligência Artificial",
		tag: "inteligencia-artificial",
		classDays: [5],
	},
	{
		name: "Computação Gráfica",
		tag: "computacao-grafica",
		classDays: [5],
	},
	{
		name: "Arquitetura de Redes de Computador",
		tag: "arquitetura-de-redes-de-computador",
		classDays: [3],
	},
	{
		name: "Outros",
		tag: "outros",
	}
] as ChannelProps[];
