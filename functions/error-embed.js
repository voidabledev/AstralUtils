const { MessageEmbed } = require('discord.js');
function errorEmbed(errText) {
	return new MessageEmbed()
		.setColor('RED')
		.setTitle('Uh oh...')
		.setDescription(`There's been an error: \`\`\`\n${errText}\n\`\`\``)
		.setFooter('Please contact a developer if the error still persists')
		.setTimestamp();
}
module.exports = errorEmbed;
