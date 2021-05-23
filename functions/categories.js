/* eslint-disable max-statements-per-line*/
async function categories(command, valid, input) {
	exports.valid = [
		'Utilities',
		'Giveaways',
		'Staff',
		'Admin',
	];
	if (command.help.hidden) return '';
	if (!command.help.category || !valid.includes(command.help.category)) {return 'Utilities';} command.help.category;
	if (
		valid.includes(
			`${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`,
		)
	) {return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;}
	else {return '';}
}

module.exports = categories;