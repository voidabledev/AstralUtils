const { MessageEmbed } = require('discord.js');
/**
 * Gives back an embed indicating command failure.
 * @param {string} failText The reason why this command failed.
 * @param {string?} failFooter The footer to the embed.
 * @returns {Object} The discord.js embed object.
 */
function failureEmbed(failText, failFooter) {
	const embed = new MessageEmbed()
		.setDescription(`<a:no:836302929781981265> ${failText}`)
		.setColor('RED');
	failFooter ? embed.setFooter(failFooter) : null;
	return embed;
}
module.exports = failureEmbed;