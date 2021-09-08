/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'balance',
	description: 'Shows your balance, or the balance of another user.',
	category: 'Economy',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to show the balance of.',
		},
	],
	async run(interaction, options, client) {
		const user = options.getUser('user') ?? interaction.user;
		const { coins } = client.economy.getProfile(user.id);
		const embed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.addField(`${user.username}'s balance`, `<:AstralCoin:877583618770370582>${coins}`)
			.setColor('RANDOM')
			.setFooter('what a noob')
			.setTimestamp();
		await interaction.reply({
			embeds: [embed],
		});
	},
};
