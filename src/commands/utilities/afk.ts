/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { fail, success } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { GuildMember } from 'discord.js';

export const command: Command = {
	name: 'afk',
	description: 'Marks you as AFK.',
	options: [
		{
			type: Options.String,
			name: 'message',
			description: 'Your AFK message',
			required: true,
		},
	],
	async run(interaction, options, client) {
		const message = options.getString('message', true);
		if (!interaction.member) return;
		if (client.afk.get(interaction.user.id)) {
			return interaction.reply({
				embeds: [fail('You are already AFK!')],
				ephemeral: true,
			});
		}
		client.afk.set(interaction.member as GuildMember, message);
		return interaction.reply({
			embeds: [success(`Your AFK message has been set: **${message}**`)],
		});
	},
};
