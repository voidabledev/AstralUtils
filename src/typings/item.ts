interface BaseItem {
	name: string;
	description: string;
	id: string;
	price: number;
	sellable: boolean;
	buyable: boolean;
	abilities: string[];
}
export type Item = BaseItem & ({
	usable: false;
} | {
	usable: true;
	use: (userId: string, amount: number) => string | Promise<string>;
})
