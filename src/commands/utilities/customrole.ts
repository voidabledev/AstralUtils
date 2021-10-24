/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { fail, success } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { Permissions, ColorResolvable, GuildMemberRoleManager, Role, GuildMember } from 'discord.js';

export const command: Command = {
	name: 'customrole',
	description: 'Custom role management.',
	options: [
		{
			type: Options.Subcommand,
			name: 'create',
			description: 'Creates a new custom role.',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user this custom role should belong to.',
					required: true,
				},
				{
					type: Options.String,
					name: 'name',
					description: 'The name of the custom role.',
					required: true,
				},
				{
					type: Options.String,
					name: 'color',
					description: 'The color of the custom role (default: transparent).',
				},
				{
					type: Options.Boolean,
					name: 'mentionable',
					description: 'Whether everyone can mention this role (default: false).',
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'delete',
			description: 'Removes a custom role. Please do not use /role delete or delete the role manually.',
			options: [
				{
					type: Options.Role,
					name: 'role',
					description: 'The custom role to delete.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'transfer',
			description: 'Registers an existing role as a custom role for another user.',
			options: [
				{
					type: Options.Role,
					name: 'role',
					description: 'The role that should be transfered.',
					required: true,
				},
				{
					type: Options.User,
					name: 'user',
					description: 'The user this custom role should be transfered to.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'edit',
			description: 'Edit your custom role!',
			options: [
				{
					type: Options.String,
					name: 'name',
					description: 'The name of the custom role.',
				},
				{
					type: Options.String,
					name: 'color',
					description: 'The color of the custom role.',
				},
				{
					type: Options.Boolean,
					name: 'mentionable',
					description: 'Whether everyone can mention this role (default: false).',
				},
				{
					type: Options.Role,
					name: 'role',
					description: 'The role that should be edited, if you have multiple or are changing someone else\'s role.',
				},
			],
		},
	],
	async allowed(interaction, client) {
		if (interaction.options.getSubcommand(true) === 'edit') return true;
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_ROLES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		if (!interaction.guild || !interaction.member) return;
		await interaction.deferReply();
		const sub = interaction.options.getSubcommand(true);
		if (sub === 'create') {
			const user = options.getUser('user', true);
			const member = options.getMember('user');
			const name = options.getString('name', true);
			const color = (options.getString('color')?.toUpperCase() as ColorResolvable) ?? undefined;
			const mentionable = options.getBoolean('mentionable') ?? false;
			const position = interaction.guild.roles.cache.get('831996405479374911')?.position;

			if (!member) {
				return interaction.followUp({
					embeds: [fail('That user is not in this server.')],
				});
			}
			const role = await interaction.guild.roles.create({
				name,
				color,
				mentionable,
				position,
			});
			await (member.roles as GuildMemberRoleManager).add(role);
			await client.customRoles.set(role.id, user.id);
			await interaction.followUp({
				embeds: [success('The custom role has been created!')],
			});
		}
		if (sub === 'delete') {
			const role = options.getRole('role') as Role;
			if (!client.customRoles.getByRole(role.id)) {
				return interaction.followUp({
					embeds: [fail('This role is not registered as a custom role!')],
				});
			}
			await client.customRoles.delete(role.id);
			await role.delete();
			await interaction.followUp({
				embeds: [success('The custom role has been deleted.')],
			});
		}
		if (sub === 'transfer') {
			const role = options.getRole('role', true) as Role;
			const member = options.getMember('user') as GuildMember;
			if (!member) {
				return interaction.followUp({
					embeds: [fail('That user is not in this server.')],
				});
			}
			const custom = client.customRoles.getByRole(role.id);
			const oldMember: GuildMember | null = await interaction.guild.members.fetch(custom?.userId).catch(() => null);
			oldMember?.roles?.remove(role);
			member.roles.add(role);
			await client.customRoles.transfer(role.id, member.user.id);
			await interaction.followUp({
				embeds: [success('The custom role has been transfered.')],
			});
		}
		if (sub === 'edit') {
			const name = options.getString('name') ?? undefined;
			const color = (options.getString('color')?.toUpperCase() as ColorResolvable) ?? undefined;
			const mentionable = options.getBoolean('mentionable') ?? false;
			let role = options.getRole('role') as Role | null;

			if (role) {
				const custom = client.customRoles.getByRole(role.id);
				if (!custom) {
					return interaction.followUp({
						embeds: [fail('The role you specified is not registered as a custom role!')],
					});
				}
				if (
					custom.userId !== interaction.user.id &&
					!(interaction.member?.permissions as Readonly<Permissions>)?.has?.('MANAGE_ROLES')
				) {
					return interaction.followUp({
						embeds: [fail('This custom role does not belong to you!')],
					});
				}
				await role.edit({
					name,
					color,
					mentionable,
				});
				return interaction.followUp({
					embeds: [success('Edited the custom role.')],
				});
			}

			const customs = client.customRoles.getByUser(interaction.user.id);
			const custom = customs.first();
			if (!custom) {
				return interaction.followUp({
					embeds: [fail('There is no custom role registered for you.')],
				});
			}
			role = interaction.guild.roles.cache.get(custom.roleId);
			await role.edit({
				name,
				color,
				mentionable,
			});
			return interaction.followUp({
				embeds: [success('Edited your custom role.')],
			});
		}
	},
};
