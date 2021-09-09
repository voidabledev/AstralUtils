/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, GuildMemberRoleManager } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { success, fail } from '../../structures/embeds';

export const command: Command = {
	name: 'giveaway',
	description: 'Creates a giveaway.',
	options: [
		{
			name: 'create',
			description: 'Create a new giveaway.',
			type: Options.Subcommand,
			options: [
				{
					name: 'prize',
					description: 'The giveaway\'s prize',
					type: Options.String,
					required: true,
				},
				{
					name: 'duration',
					description: 'The giveaway\'s duration',
					type: Options.Number,
					required: true,
				},
				{
					name: 'duration-unit',
					description: 'The unit to specify the giveaway\'s duration in',
					type: Options.Integer,
					required: true,
					choices: [
						{ name: 'Minute(s)', value: 1000 * 60 },
						{ name: 'Hour(s)', value: 1000 * 60 * 60 },
						{ name: 'Day(s)', value: 1000 * 60 * 60 * 24 },
					],
				},
				{
					name: 'winners',
					description: 'The amount of winners for this giveaway',
					type: Options.Integer,
					required: true,
				},
				{
					name: 'sponsor',
					description: 'The sponsor of this giveaway, if they are not the host',
					type: Options.User,
				},
				{
					name: 'requirement',
					description: 'The requirement for this giveaway, if any',
					type: Options.String,
				},
				{
					name: 'claim-time',
					description: 'How much time users have to claim - you have to check this manually!',
					type: Options.String,
				},
				{
					name: 'notes',
					description: 'Any additional information you may want to provide.',
					type: Options.String,
				},
				{
					name: 'ping',
					description: 'What role to ping for the giveaway',
					type: Options.String,
					choices: [
						{ name: 'None', value: '' },
						{ name: 'Giveaway Ping', value: '<@&831996472458477588>\n' },
						{ name: 'Nitro Giveaway Ping', value: '<@&831996471566008340>\n' },
					],
				},
			],
		},
		{
			name: 'edit',
			description: 'Edit an existing  giveaway.',
			type: Options.Subcommand,
			options: [
				{
					name: 'message-id',
					description: 'The ID of the giveaway\'s message.',
					type: Options.String,
					required: true,
				},
				{
					name: 'prize',
					description: 'The giveaway\'s prize',
					type: Options.String,
				},
				{
					name: 'duration',
					description: 'The giveaway\'s duration',
					type: Options.Number,
				},
				{
					name: 'duration-unit',
					description: 'The unit to specify the giveaway\'s duration in',
					type: Options.Integer,
					choices: [
						{ name: 'Minute(s)', value: 1000 * 60 },
						{ name: 'Hour(s)', value: 1000 * 60 * 60 },
						{ name: 'Day(s)', value: 1000 * 60 * 60 * 24 },
					],
				},
				{
					name: 'winners',
					description: 'The amount of winners for this giveaway',
					type: Options.Integer,
				},
				{
					name: 'sponsor',
					description: 'The sponsor of this giveaway, if they are not the host',
					type: Options.User,
				},
				{
					name: 'requirement',
					description: 'The requirement for this giveaway, if any',
					type: Options.String,
				},
				{
					name: 'claim-time',
					description: 'How much time users have to claim - you have to check this manually!',
					type: Options.String,
				},
				{
					name: 'notes',
					description: 'Any additional information you may want to provide.',
					type: Options.String,
				},
			],
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.member?.roles as GuildMemberRoleManager).cache.find((r) =>
				r.name.endsWith('Giveaways'),
			) !== undefined ||
			(interaction.member?.permissions as Readonly<Permissions>).has(
				'MANAGE_MESSAGES',
			)
		);
	},
	async run(interaction, options, client) {
		if (!interaction.channel || !interaction.guild) return;
		const subcommand = options.getSubcommand(true);
		if (subcommand === 'create') {
			const prize = options.getString('prize', true);
			const duration =
				options.getNumber('duration', true) *
				options.getInteger('duration-unit', true);
			const winnerCount = options.getInteger('winners', true);
			const sponsor = options.getUser('sponsor') ?? undefined;
			const requirement = options.getString('requirement') ?? undefined;
			const claimTime = options.getString('claim-time') ?? undefined;
			const notes = options.getString('notes') ?? undefined;
			const ping = options.getString('ping') ?? '';
			if (winnerCount < 1 || winnerCount > 5) {
				return interaction.reply({
					embeds: [fail('Giveaways have to have between 1 and 5 winners!')],
					ephemeral: true,
				});
			}
			await client.giveaways.create(
				{
					channelId: interaction.channel.id,
					guildId: interaction.guild.id,
					prize,
					start: Date.now(),
					end: Date.now() + duration,
					winnerCount,
					host: interaction.user.id,
					sponsor: sponsor?.id,
					requirement,
					claimTime,
					notes,
				},
				`${ping}:tada: **GIVEAWAY** :tada:`,
				interaction,
			);
			await interaction.reply({
				embeds: [success('The giveaway has been created. Click the control button to manage it.')],
				ephemeral: true,
			});
		}
		if (subcommand === 'edit') {
			const messageId = options.getString('message-id', true);
			const prize = options.getString('prize') ?? undefined;
			const duration = options.getNumber('duration') ?? undefined;
			const durationUnit = options.getInteger('duration-unit') ?? 60_000;
			const winnerCount = options.getInteger('winners') ?? undefined;
			const sponsor = options.getUser('sponsor')?.id ?? undefined;
			const requirement = options.getString('requirement') ?? undefined;
			const claimTime = options.getString('claim-time') ?? undefined;
			const notes = options.getString('notes') ?? undefined;
			const end = duration ? Date.now() + duration * durationUnit : undefined;
			if (winnerCount && (winnerCount < 1 || winnerCount > 5)) {
				return interaction.reply({
					embeds: [fail('Giveaways have to have between 1 and 5 winners!')],
					ephemeral: true,
				});
			}
			await client.giveaways
				.update(messageId, {
					prize,
					end,
					winnerCount,
					sponsor,
					requirement,
					claimTime,
					notes,
				})
				.then(() =>
					interaction.reply({ embeds: [success('Giveaway edited!')] }),
				)
				.catch((e) => interaction.reply({ embeds: [fail(e.message)] }));
		}
	},
};
