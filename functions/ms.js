async function ms(input) {
	if (typeof input !== 'string') return -1;
	if (isNaN(input.slice(0, -1))) return -1;
	const inputNumber = parseInt(input.slice(0, -1));
	if (input.endsWith('d')) return inputNumber * 1000 * 60 * 60 * 24;
	if (input.endsWith('h')) return inputNumber * 1000 * 60 * 60;
	if (input.endsWith('m')) return inputNumber * 1000 * 60;
	if (input.endsWith('s')) return inputNumber * 1000;
	return -1;
}
module.exports = ms;