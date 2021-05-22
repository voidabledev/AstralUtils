const { MessageEmbed } = require('discord.js');
async function failureEmbed(failText, failFooter) {
	new MessageEmbed()
		.setTitle('Failure!')
		.setDescription(failText)
		.setColor('RED')
		.setFooter(failFooter || null);
}
module.exports = failureEmbed;
