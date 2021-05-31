const { MessageEmbed } = require('discord.js');
function failureEmbed(failText, failFooter) {
	const embed = new MessageEmbed()
		.setDescription('<a:no:836302929781981265>', failText)
		.setColor('RED');
	failFooter ? embed.setFooter(failFooter) : null;
	return embed;
}
module.exports = failureEmbed;