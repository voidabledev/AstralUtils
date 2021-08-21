/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
	GuildMember,
	GuildMemberRoleManager,
} from 'discord.js';
import { success, fail, confirm } from '../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'dm',
	description: 'Notify a user in DMs.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to send the message to.',
			required: true,
		},
		{
			type: Options.String,
			name: 'message',
			description: 'The message to send.',
			required: true,
		},
		{
			type: Options.Boolean,
			name: 'anonymous',
			description: 'Whether or not to hide your username.',
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'ADMINISTRATOR',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const user = options.getUser('user', true);
		const message = options.getString('message', true);
		const anon = options.getBoolean('anonymous') ?? false;
		const embed = new MessageEmbed()
			.setTitle('Direct Message')
			.setDescription(`From **${interaction.guild?.name}**\n${message}`)
			.setFooter(
				`You were messaged by ${
					anon ? 'the Astral Galaxy Management Team' : interaction.user.tag
				}`,
			);
		try {
			await user.send({ embeds: [embed] });
			await interaction.reply({
				embeds: [success(`I've sent the message to ${user}!`)],
			});
		}
		catch (e) {
			await interaction.reply({
				embeds: [fail(`I was unable to DM ${user}.`)],
			});
		}
	},
};
