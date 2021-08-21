/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { fail } from '../modules/embeds';
import { MessageEmbed, Permissions } from 'discord.js';

export const command: Command = {
	name: 'case',
	description: 'View information on a moderation case.',
	options: [
		{
			name: 'punish-id',
			description: 'The 10-digit punishment ID.',
			type: Options.Integer,
			required: true,
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
		const punishID = options.getInteger('punish-id', true).toString();
		const log = await client.modlogs.get(punishID);
		if (!log) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find a punishment with this ID!')],
			});
		}

		const embed = new MessageEmbed()
			.setAuthor(
				interaction.user.tag,
				interaction.user.avatarURL({ dynamic: true }) ?? undefined,
			)
			.setTitle('Case Information')
			.addField('Type', log.caseType)
			.addField('Moderator', `<@${log.staffID}> (${log.staffID})`)
			.addField('User', `<@${log.userID}> (${log.userID})`)
			.addField('Reason', log.reason)
			.addField(
				'Time',
				`<t:${Math.floor(log.timestamp / 1000)}:R> (<t:${Math.floor(
					log.timestamp / 1000,
				)}:f>)`,
			)
			.addField(
				log.isActive !== false ? 'Expires' : 'Expired',
				log.expires
					? `<t:${Math.floor(log.expires / 1000)}:R> (<t:${Math.floor(
						log.expires / 1000,
					)}:f>)`
					: 'Not Applicable',
			)
			.setFooter(`Punishment ID: ${punishID}`)
			.setColor('RANDOM');
		interaction.reply({
			embeds: [embed],
		});
	},
};
