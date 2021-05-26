const { MessageEmbed } = require('discord.js');
function failureEmbed(failText, failFooter) {
	return new MessageEmbed()
		.setTitle('Failure!')
		.setDescription(failText)
		.setColor('RED')
		.setFooter(failFooter || null);
}
module.exports = failureEmbed;
