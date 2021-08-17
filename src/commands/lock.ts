import { Command } from '../typings/command';
import { MessageEmbed, Permissions } from 'discord.js';
import { success, fail } from '../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'lock',
	description: 'Lock a channel.',
	options: [
		{
			type: Options.Channel,
			name: 'channel',
			description: 'The channel to lock.',
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'Why this channel has been locked.',
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
		if (!interaction.inGuild()) return;

		const channel = options.getChannel('channel') ?? interaction.channel;
		const reason = options.getString('reason') ?? 'No reason specified';

		if (
			!interaction.guild ||
			!channel ||
			!('isText' in channel) ||
			channel.type === 'DM'
		) {
			return;
		}
		if (channel.isThread()) {
			return interaction.reply({
				embeds: [
					fail(
						'You can\'t lock a thread! Run the command on a regular channel instead.',
					),
				],
				ephemeral: true,
			});
		}
		if (!channel.isText()) return;

		if (
			!channel
				.permissionsFor(interaction.guild.roles.everyone)
				.has('SEND_MESSAGES')
		) {
			return interaction.reply({
				embeds: [fail('This channel is already locked!')],
				ephemeral: true,
			});
		}

		channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
			SEND_MESSAGES: false,
			USE_PUBLIC_THREADS: false,
			USE_PRIVATE_THREADS: false,
		});

		await interaction.reply({
			embeds: [success(`${channel} has been locked down for \`${reason}\``)],
			ephemeral: true,
		});

		const embed = new MessageEmbed()
			.setTitle('Lockdown')
			.setDescription(`This channel has been locked down for:\n\`${reason}\``)
			.setFooter(
				'Do NOT DM staff members saying you\'re muted, because you\'re not.',
			)
			.setColor('RED');
		await channel.send({
			embeds: [embed],
		});
	},
};
