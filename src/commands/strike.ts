import { id } from '../modules/utils';
import { Command } from '../typings/command';
import { confirm, success, fail } from '../modules/embeds';
import { strikeModel } from '../models/strikeModel';
import {
	MessageEmbed,
	Permissions,
	GuildMemberRoleManager,
	TextChannel,
} from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'strike',
	description: 'Strikes a staff member.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user getting striked.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reasoning for the strike.',
			required: true,
		},
		{
			type: Options.Subcommand,
			name: 'remove',
			description: 'To remove a strike',
			options: [
				{
					type: Options.String,
					name: 'strike-id',
					description: 'The ID of the strike being removed.',
					required: true,
				},
			],
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.member?.roles as GuildMemberRoleManager).cache.find((r) =>
				r.name.endsWith('Manager'),
			) !== undefined
		);
	},
	async run(interaction, options, client) {
		const user = options.getUser('user', true);
		const member = interaction.guild?.members.fetch(user.id);
		const reason = options.getString('reason', true);
		const subcommand = options.getSubcommand();
		const strikeID = id(36, 8);
		if (reason.length > 5) {
			return interaction.reply({
				embeds: [fail('Please provide a more specific reason.')],
				ephemeral: true,
			});
		}
		if (user.id === interaction.user.id) {
			return interaction.reply({
				embeds: [fail('You can\'t strike yourself.')],
				ephemeral: true,
			});
		}
		if (
			(interaction.member?.roles as GuildMemberRoleManager).highest.position <
			((await member)?.roles as GuildMemberRoleManager).highest.position
		) {
			return interaction.reply({
				embeds: [fail('You can\'t strike people above you.')],
				ephemeral: true,
			});
		}
		let messaged: string;
		const embed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setTitle(`You were striked on ${interaction.guild?.name}`)
			.addField('Reason', reason)
			.addField('Strike ID', `\`${strikeID}\``)
			.setTimestamp();
		user
			.send({ embeds: [embed] })
			.catch(() => (messaged = 'I was unable to DM this user.'));
		const logEmbed = new MessageEmbed()
			.setAuthor(
				interaction.user.tag,
				interaction.user.displayAvatarURL({ dynamic: true, size: 512 }),
			)
			.setTitle('New Strike')
			.addField('Reason', reason)
			.addField('Strike ID', `\`${strikeID}\``)
			.setTimestamp();
		const channel = client.channels.fetch('831996554763829338');
		(channel as TextChannel)?.send({ embeds: [logEmbed] });
		// TODO: finish this
	},
};
