const { MessageEmbed } = require('discord.js');
function successEmbed(succText, succFooter) {
	return new MessageEmbed()
		.setTitle('Success!')
		.setDescription(succText)
		.setFooter(succFooter || null)
		.setColor('GREEN');
}
module.exports = successEmbed;