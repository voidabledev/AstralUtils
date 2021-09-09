/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, TextChannel, GuildMemberRoleManager } from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'slowmode',
	description: 'Changes the slowmode on a channel.',
	options: [
		{
			type: Options.String,
			name: 'seconds',
			description: 'The seconds of the slowmode.',
			required: true,
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_MESSAGES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const seconds = options.getString('seconds', true);
		if (!seconds) {
			return interaction.reply({
				content: `The channel slowmode is \`${(interaction.channel as TextChannel).rateLimitPerUser}\`.`,
			});
		}
		const slowmode = parseInt(seconds);
		let max = -1;
		let pos = '';
		if ((interaction.member?.roles as GuildMemberRoleManager).cache.get('831996402619777045')) {
			max = 30;
			pos = 'Trainee Moderator';
		}
		if ((interaction.member?.roles as GuildMemberRoleManager).cache.get('831996401872535573')) {
			max = 60;
			pos = 'Moderator';
		}
		if ((interaction.member?.roles as GuildMemberRoleManager).cache.get('831996400782016563')) {
			max = 200;
			pos = 'Head Moderator';
		}
		if (pos.length && slowmode > max) {
			await confirm(interaction, `As a ${pos}, you're restricted to \`${max}\`, are you sure you want to set the slowmode to ${slowmode}?`);
		}
		(interaction.channel as TextChannel)?.setRateLimitPerUser(slowmode);
		if (slowmode === 0) {
			return interaction.reply({
				content: 'Slowmode has been turned off. Go crazy!',
			});
		}
		interaction.editReply({
			content: `Slowmode has been changed to \`${slowmode}\`.`,
		});
	},
};