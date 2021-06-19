/**
 * Generates a random ID.
 * @param {number} base The number base for the returned ID
 * @param {number} length The length of the ID
 * @param {boolean} zeroes Whether or not to add leading zeroes.
 * @returns {string} A random ID with the specified base and length.
 */
function id(base, length, zeroes = true) {
	let gen = Math.floor(Math.random() * base ** length).toString(base);
	while (gen.length < length && zeroes) {
		gen = '0' + gen;
	}
	return gen;
}

module.exports = id;