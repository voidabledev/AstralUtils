const { MessageEmbed } = require('discord.js');
async function successEmbed(succText, succFooter) {
	new MessageEmbed()
		.setTitle('Success!')
		.setDescription(succText)
		.setFooter(succFooter || null)
		.setColor('GREEN');
}
module.exports = successEmbed;