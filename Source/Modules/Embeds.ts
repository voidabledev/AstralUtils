import { MessageEmbed } from 'discord.js';

export function success(message: string, footer?: string): MessageEmbed {
	const embed = new MessageEmbed()
		.setDescription(`<a:yes:836302807485251674> ${message}`)
		.setColor('GREEN');
	if(footer) embed.setFooter(footer);
	return embed;
}

export function fail(message: string, footer?: string): MessageEmbed {
	const embed = new MessageEmbed()
		.setDescription(`<a:no:836302929781981265> ${message}`)
		.setColor('RED');
	if(footer) embed.setFooter(footer);
	return embed;
}

// TODO: Implement these embeds into commands
// TODO: Make a prompt embed with cancel / confirm button handling