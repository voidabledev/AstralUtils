const { MessageEmbed } = require('discord.js');
function successEmbed(succText, succFooter) {
	const embed = new MessageEmbed()
		.setDescription('<a:yes:836302807485251674>', succText)
		.setColor('GREEN');
	succFooter ? embed.setFooter(succFooter) : null;
	return embed;
}
module.exports = successEmbed;