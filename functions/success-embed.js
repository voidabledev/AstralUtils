const { MessageEmbed } = require('discord.js');
function successEmbed(succText, succFooter) {
	const embed = new MessageEmbed()
		.setTitle('Success!')
		.setDescription(succText)
		.setColor('GREEN');
	succFooter ? embed.setFooter(succFooter) : null;
	return embed;
}
module.exports = successEmbed;