async function isenabled(value) {
	if (!value) return 'No';
	if (typeof value === 'object' || typeof value === typeof 'array') {
		if (!value.length || !value.length <= 0) return 'No';
		else return 'Yes';
	}

	if (typeof value === 'boolean') {
		if (value === true) return 'Yes';
		if (value === false || value === null || value === undefined) return 'No';
	}

	if (typeof value === 'number') {
		if (!~value || value === 0) return 'No';
		else return 'Yes';
	}

	return 'No';
}

module.exports = isenabled;