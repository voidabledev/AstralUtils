/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions, TextChannel, ColorResolvable, GuildMemberRoleManager, Role, GuildMember } from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'role',
	description: 'Actions related to role management.',
	options: [
		{
			type: Options.Subcommand,
			name: 'create',
			description: 'Create a new role.',
			options: [
				{
					type: Options.String,
					name: 'name',
					description: 'The name of the role.',
					required: true,
				},
				{
					type: Options.String,
					name: 'color',
					description: 'The color of the role. If an invalid or no color is specified, the role will be transparent.',
				},
				{
					type: Options.Boolean,
					name: 'mentionable',
					description: 'If everyone is allowed to mention this role.',
				},
				{
					type: Options.Boolean,
					name: 'hoist',
					description: 'Display role members seperately from online members.',
				},
				{
					type: Options.Role,
					name: 'position',
					description: 'If specified, the new role will be placed above the specified role.',
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'edit',
			description: 'Update an existing role.',
			options: [
				{
					type: Options.Role,
					name: 'role',
					description: 'The role you want to edit.',
					required: true,
				},
				{
					type: Options.String,
					name: 'name',
					description: 'The new name of the role.',
				},
				{
					type: Options.String,
					name: 'color',
					description: 'The new color of the role. If an invalid color is specified, the role will be transparent.',
				},
				{
					type: Options.Boolean,
					name: 'mentionable',
					description: 'If everyone is allowed to mention this role.',
				},
				{
					type: Options.Boolean,
					name: 'hoist',
					description: 'Display role members seperately from online members.',
				},
				{
					type: Options.Role,
					name: 'position',
					description: 'If specified, the role will be placed above the specified role.',
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'delete',
			description: 'Delete a role.',
			options: [
				{
					type: Options.Role,
					name: 'role',
					description: 'The role to delete.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'give',
			description: 'Give someone a role.',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user to give the role to.',
					required: true,
				},
				{
					type: Options.Role,
					name: 'role',
					description: 'The role to give.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'remove',
			description: 'Take a role away from someone.',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user to take the role away from.',
					required: true,
				},
				{
					type: Options.Role,
					name: 'role',
					description: 'The role to remove.',
					required: true,
				},
			],
		},
	],
	async allowed(interaction, client) {
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
		const sub = options.getSubcommand(true);

		if (sub === 'create') {
			const name = options.getString('name', true);
			const color = (options.getString('color') ?? '#000000') as ColorResolvable;
			const mentionable = options.getBoolean('mentionable') ?? false;
			const hoist = options.getBoolean('hoist') ?? false;
			const position = (options.getRole('position')?.position ?? 0) + 1;
			if (position > (interaction.member.roles as GuildMemberRoleManager).highest.position) {
				return interaction.reply({
					embeds: [fail('You can\'t create a role above your highest role!')],
				});
			}
			try {
				const role = await interaction.guild.roles.create({
					name,
					color,
					mentionable,
					hoist,
					position,
				}).catch(() => interaction.guild.roles.create({
					name,
					mentionable,
					hoist,
					position,
				}));
				return interaction.reply({
					embeds: [success(`Created role ${role}!`)],
				});
			}
			catch (e) {
				await interaction.reply({
					embeds: [fail(`Unable to create a role: ${e}`)],
				});
			}
		}

		if (sub === 'edit') {
			const role = options.getRole('role', true) as Role;
			const name = options.getString('name') ?? undefined;
			const color = (options.getString('color') ?? undefined) as ColorResolvable;
			const mentionable = options.getBoolean('mentionable') ?? undefined;
			const hoist = options.getBoolean('hoist') ?? undefined;
			const pos = (options.getRole('position')?.position ?? 0) + 1;
			const position = pos === 1 ? undefined : pos;
			if (role.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) {
				return interaction.reply({
					embeds: [fail('You can\'t edit roles above your highest role!')],
				});
			}
			if (position > (interaction.member.roles as GuildMemberRoleManager).highest.position) {
				return interaction.reply({
					embeds: [fail('You can\'t move roles above your highest role!')],
				});
			}
			try {
				await role.edit({
					name,
					color,
					mentionable,
					hoist,
					position,
				}).catch(() => interaction.guild.roles.create({
					name,
					mentionable,
					hoist,
					position,
				}));
				return interaction.reply({
					embeds: [success(`Edited role ${role}!`)],
				});
			}
			catch (e) {
				await interaction.reply({
					embeds: [fail(`Unable to edit this role: ${e}`)],
				});
			}
		}

		if (sub === 'delete') {
			const role = options.getRole('role', true) as Role;
			if (role.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) {
				return interaction.reply({
					embeds: [fail('You can\'t delete roles above your highest role!')],
				});
			}
			await role.delete();
			await interaction.reply({
				embeds: [success(`Deleted the role "${role.name}"`)],
			});
		}

		if (sub === 'give') {
			const member = interaction.options.getMember('user', true) as GuildMember;
			const role = interaction.options.getRole('role', true) as Role;
			if (role.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) {
				return interaction.reply({
					embeds: [fail('You can\'t give out roles higher than your highest role!')],
				});
			}
			if (member.roles.cache.has(role.id)) {
				return interaction.reply({
					embeds: [fail(`${member} already has the ${role} role.`)],
				});
			}
			await member.roles.add(role);
			await interaction.reply({
				embeds: [success(`Gave the ${role} role to ${member}.`)],
			});
		}

		if (sub === 'remove') {
			const member = interaction.options.getMember('user', true) as GuildMember;
			const role = interaction.options.getRole('role', true) as Role;
			if (role.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) {
				return interaction.reply({
					embeds: [fail('You can\'t remove roles higher than your highest role!')],
				});
			}
			if (!member.roles.cache.has(role.id)) {
				return interaction.reply({
					embeds: [fail(`${member} doesn't have the ${role} role.`)],
				});
			}
			await member.roles.remove(role);
			await interaction.reply({
				embeds: [success(`Removed the ${role} role from ${member}.`)],
			});
		}
	},
};
