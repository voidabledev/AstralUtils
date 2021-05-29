const { MessageEmbed } = require('discord.js');
function failureEmbed(failText, failFooter) {
	const embed = new MessageEmbed()
		.setTitle('Failure!')
		.setDescription(failText)
		.setColor('RED');
	failFooter ? embed.setFooter(failFooter) : null;
	return embed;
}
module.exports = failureEmbed;