/* eslint-disable @typescript-eslint/no-unused-vars */
import { id } from '../../structures/utils';
import { Command } from '../../typings/command';
import { confirm, success, fail } from '../../structures/embeds';
import { strikeModel } from '../../models/strikeModel';
import {
	MessageEmbed,
	GuildMemberRoleManager,
	TextChannel,
	GuildMember,
} from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'strike',
	description: 'Manage strikes.',
	options: [
		{
			type: Options.Subcommand,
			name: 'create',
			description: 'Strike a staff member.',
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
			],
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
		const subcommand = options.getSubcommand(true);
		if (subcommand === 'create') {
			const user = options.getUser('user', true);
			const member = options.getMember('user');
			const reason = options.getString('reason', true);
			const strikeID = id(36, 8);
			if (!member || !(member instanceof GuildMember)) {
				return interaction.reply({
					embeds: [
						fail('The person you\'re trying to strike isn\'t in this server!'),
					],
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
				(interaction.member?.roles as GuildMemberRoleManager).highest
					.position <= member.roles.highest.position
			) {
				return interaction.reply({
					embeds: [
						fail('You can\'t strike people above or the same rank as you.'),
					],
					ephemeral: true,
				});
			}
			if (reason.length < 5) {
				return interaction.reply({
					embeds: [fail('Please provide a more specific reason!')],
					ephemeral: true,
				});
			}
			try {
				await confirm(
					interaction,
					`Are you sure you want to strike ${user} for **\`${reason}\`**?`,
				);
			}
			catch (e) {
				return interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			}
			await strikeModel.create({
				userID: user.id,
				managerID: interaction.user.id,
				strikeID,
			});
			let messaged = '';
			const embed = new MessageEmbed()
				.setAuthor(
					user.tag,
					user.displayAvatarURL({ dynamic: true, size: 512 }),
				)
				.setTitle(`You were striked on ${interaction.guild?.name}`)
				.addField('Reason', reason)
				.addField('Strike ID', `\`${strikeID}\``)
				.setColor('GREY')
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
				.setColor('RED')
				.addField('User', `${user}`)
				.addField('Reason', reason)
				.addField('Strike ID', `\`${strikeID}\``)
				.setTimestamp();
			const channel = client.channels.cache.get('831996554763829338');
			(channel as TextChannel)?.send({ embeds: [logEmbed] });
			await interaction.editReply({
				embeds: [success(`${user} has been striked with strike id \`${strikeID}\`. ${messaged}`)],
				compontents: [],
			});
		}
		if (subcommand === 'remove') {
			const strikeID = options.getString('strike-id', true);
			const strike = await strikeModel.findOne({ strikeID });
			if (!strike) {
				return interaction.reply({
					embeds: [fail(`I couldn't find a strike with ID \`${strikeID}\`!`)],
					ephemeral: true,
				});
			}
			const channel = client.channels.cache.get('831996554763829338');
			const message = (
				await (channel as TextChannel).messages.fetch({ limit: 100 })
			)
				.filter(
					(msg) =>
						(msg.embeds[0]?.fields[2]?.value === `\`${strikeID}\`` ||
							msg.embeds[0]?.description?.endsWith(`\`${strikeID}\`.`)) ??
						false,
				)
				.first();
			try {
				await confirm(
					interaction,
					`Are you sure you want to remove [this strike](${
						message?.url ?? 'Message not found'
					})?`,
				);
			}
			catch (e) {
				return interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			}
			await strikeModel.deleteOne({ strikeID });
			if (message) await message.delete();
			await interaction.editReply({
				embeds: [success(`Removed the strike with ID **\`${strikeID}\`**`)],
				components: [],
			});
		}
	},
};
