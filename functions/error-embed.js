const Discord = require('discord.js');
async function errorEmbed(errText) {
	new Discord.MessageEmbed()
		.setColor('RED')
		.setTitle('Uh oh...')
		.setDescription(`There's been an error: ${errText}`)
		.setFooter('Please contact a developer if the error still persists')
		.setTimestamp();
}
module.exports = errorEmbed;