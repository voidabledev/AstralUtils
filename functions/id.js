async function id(base, length, zeroes) {
	let gen = Math.floor(Math.random() * base ** length).toString(base);
	while (gen.length < length && zeroes !== false) {
		gen = '0' + gen;
	}
	return gen;
}

module.exports = id;
