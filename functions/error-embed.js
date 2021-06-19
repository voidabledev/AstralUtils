const { MessageEmbed } = require('discord.js');
/**
 * Gives back an embed indicating an error in the code.
 * @param {string} errText The error text.
 * @returns {Object} The discord.js embed object.
 */
function errorEmbed(errText) {
	return new MessageEmbed()
		.setColor('RED')
		.setDescription(`<a:error:849037573912657932> There's been an error: \`\`\`\n${errText}\n\`\`\``)
		.setFooter('Please contact a developer if the error still persists')
		.setTimestamp();
}
module.exports = errorEmbed;
