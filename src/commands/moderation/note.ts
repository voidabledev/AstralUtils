/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, GuildMemberRoleManager, MessageEmbed } from 'discord.js';
import { noteModel } from '../../models/noteModel';
import { id } from '../../structures/utils';
import { success, fail, pageMenu, parsePages } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'note',
	description: 'Adds a note to a user.',
	options: [
		{
			type: Options.Subcommand,
			name: 'create',
			description: 'Creates a note.',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user that gets the note. Remember: The user doesn\'t get notified.',
					required: true,
				},
				{
					type: Options.String,
					name: 'note',
					description: 'The note to create.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'list',
			description: 'Lists all notes from a user.',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user to list notes.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'view',
			description: 'View a specific note.',
			options: [
				{
					type: Options.String,
					name: 'note-id',
					description: 'The note to view.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'delete',
			description: 'Delete a specific note.',
			options: [
				{
					type: Options.String,
					name: 'note-id',
					description: 'The note to delete.',
					required: true,
				},
			],
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
		const subcommand = options.getSubcommand(true);
		if (subcommand === 'create') {
			const user = options.getUser('user', true);
			const member = options.getMember('user');
			const note = options.getString('note', true);
			const noteID = id(12, 12);
			if (note.length < 5) {
				return interaction.reply({
					embeds: [fail('You have to be more specific on the note.')],
				});
			}
			if (user.id === interaction.user.id) {
				return interaction.reply({
					embeds: [fail('You can\'t add notes to yourself.')],
				});
			}
			if (
				(interaction.member?.roles as GuildMemberRoleManager).highest.position <=
        (member?.roles as GuildMemberRoleManager).highest.position
			) {
				return interaction.reply({
					embeds: [
						fail('You can\'t add notes to people above, you.'),
					],
					ephemeral: true,
				});
			}
			await noteModel.create({
				userID: user.id,
				staffID: interaction.user.id,
				noteID,
				note,
			});
			interaction.reply({
				embeds: [success('The note has been added to the user.')],
			});
		}
	},
};