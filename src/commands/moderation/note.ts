/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, GuildMemberRoleManager, MessageEmbed, EmbedFieldData } from 'discord.js';
import { noteModel } from '../../models/noteModel';
import { id } from '../../structures/utils';
import { success, fail, confirm, pageMenu, parsePages } from '../../structures/embeds';
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
		const sub = options.getSubcommand(true);

		/* /note create [user] */
		if (sub === 'create') {
			const user = options.getUser('user', true);
			const member = options.getMember('user');
			const note = options.getString('note', true);

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
						fail('You can\'t add notes to people above you.'),
					],
					ephemeral: true,
				});
			}

			const entry = await client.notes.set(user.id, interaction.user.id, note);
			interaction.reply({
				embeds: [success(`The note has been added to <@${user.id}> | \`${entry.noteId}\`.`)],
			});
		}

		/* /note list [user] */
		if (sub === 'list') {
			const user = options.getUser('user', true);
			const notes = client.notes.find(user.id);
			if (!notes.size) {
				return interaction.reply({
					embeds: [fail('This user has no notes.')],
				});
			}
			await interaction.guild.members.fetch();
			const fields: EmbedFieldData[] = notes.map((n) => {
				const s = client.users.cache.get(n.staffId);
				return {
					name: `**Note ID:** \`${n.noteId}\` - <t:${Math.floor(n.timestamp / 1000)}:R> by ${s?.tag ?? '<Unknown User>'}`,
					value: n.note.slice(0, 100) + (n.note.length >= 100 ? '...' : ''),
				};
			});
			const embeds = parsePages(fields, new MessageEmbed({
				title: `Notes for ${user.tag}`,
				description: `Found a total of ${notes.size} notes for ${user}`,
				color: 'BLURPLE',
			}));
			await pageMenu(interaction, embeds);
		}

		/* /note view [note-id] */
		if (sub === 'view') {
			const noteId = options.getString('note-id', true);
			const note = client.notes.get(noteId);

			if (!note) {
				return interaction.reply({
					embeds: [fail('I was unable to find the note you requested!')],
				});
			}
			const embed = new MessageEmbed({
				title: `**Note ID:** \`${note.noteId}\``,
				description: `This note was created by <@${note.staffId}> <t:${Math.floor(note.timestamp / 1000)}:R> (<t:${Math.floor(note.timestamp / 1000)}:f>).`,
				fields: [
					{ name: 'Content', value: note.note },
				],
				color: 'BLURPLE',
			});
			await interaction.reply({ embeds: [embed] });
		}

		/* /note delete [note-id] */
		if (sub === 'delete') {
			const noteId = options.getString('note-id', true);
			const note = client.notes.get(noteId);

			if (!note) {
				return interaction.reply({
					embeds: [fail('I was unable to find the note you requested!')],
				});
			}
			try {
				await confirm(interaction, `Are you sure you want to delete the note with ID \`${note.noteId}\`?`);
			}
			catch (e) {
				return interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			}
			await client.notes.delete(note.noteId);
			await interaction.editReply({
				embeds: [success(`Successfully deleted the note with ID \`${note.noteId}\`.`)],
				components: [],
			});
		}
	},
};