const { MessageEmbed } = require('discord.js');
/**
 * Generates an embed indicating a command succeeded.
 * @param {string} succText The text to display as the embed description
 * @param {string?} succFooter The text to display as the embed footer.
 * @returns {Object} The success embed.
 */
function successEmbed(succText, succFooter) {
	const embed = new MessageEmbed()
		.setDescription(`<a:yes:836302807485251674> ${succText}`)
		.setColor('GREEN');
	succFooter ? embed.setFooter(succFooter) : null;
	return embed;
}
module.exports = successEmbed;