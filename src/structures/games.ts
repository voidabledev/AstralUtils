export class TicTacToe extends Array<Array<0 | 1 | -1>> {
	constructor(size = 3) {
		super(size);
		for (let i = 0; i < size; i++) {
			this[i] = [];
			for (let j = 0; j < size; j++) {
				this[i][j] = 0;
			}
		}
	}
	public state(): 0 | 1 | -1 | undefined {
		const horizontal = this.find((v) => v.every((x) => x === v[0]));
		if (horizontal && horizontal[0]) return horizontal[0];

		const vertical = this.invert().find((v) => v.every((x) => x === v[0]));
		if (vertical && vertical[0]) return vertical[0];

		const diagonal1 = this.map((_, i) => this[i][i]);
		if (diagonal1.every((x) => x === diagonal1[0]) && diagonal1[0]) return diagonal1[0];

		const diagonal2 = this.map((_, i) => this[i][this.length + ~i]);
		if (diagonal2.every((x) => x === diagonal2[0]) && diagonal2[0]) return diagonal2[0];

		if (this.every((v) => v.every((x) => !!x))) return 0;

		return undefined;

	}
	public invert(): TicTacToe {
		const that = new TicTacToe();
		that.forEach((_, i) => {
			that[i] = this.map((v) => v[i]);
		});
		return that;
	}
}