import { Command } from '../Typings/Command';
import { Permissions, GuildMemberRoleManager } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { fail } from '../Modules/Embeds';

export const command: Command = {
	name: 'giveaway',
	description: 'Creates a giveaway.',
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
	async allowed(interaction, client) {
		return ((interaction.member?.roles as GuildMemberRoleManager).cache.find((r) => r.name.endsWith('Giveaways')) !== undefined) || (interaction.member?.permissions as Readonly<Permissions>).has('MANAGE_MESSAGES');
	},
	async run(interaction, options, client) {
		const prize = options.getString('prize', true);
		const duration = options.getNumber('duration', true) * options.getInteger('duration-unit', true);
		const winnerCount = options.getInteger('winners', true);
		const sponsor = options.getUser('sponsor') ?? undefined;
		const requirement = options.getString('requirement') ?? undefined;
		const ping = options.getString('ping') ?? '';

		if (!interaction.channel || !interaction.guild) return;

		if (winnerCount < 1 || winnerCount > 5) return interaction.reply({ embeds: [fail('Giveaways have to have between 1 and 5 winners!')] });

		await client.giveaways.create({
			channelId: interaction.channel.id,
			guildId: interaction.guild.id,
			prize,
			start: Date.now(),
			end: Date.now() + duration,
			winnerCount,
			host: interaction.user.id,
			sponsor: sponsor?.id,
			requirement,
		}, `${ping}:tada: **GIVEAWAY** :tada:`, interaction);
	},
};