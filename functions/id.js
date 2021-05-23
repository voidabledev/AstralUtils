/* eslint-disable */
async function id(base, length) {
	let id = Math.floor(Math.random() * base ** length).toString(base);
	while (id.length < length) {
		id = '0' + id;
	}
	return id;
}

module.exports = id;
