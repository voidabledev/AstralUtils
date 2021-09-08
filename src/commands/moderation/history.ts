/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { fail, pageMenu, parsePages } from '../../structures/embeds';
import { MessageEmbed, Permissions } from 'discord.js';

export const command: Command = {
	name: 'history',
	description: 'Search all punishments a user has.',
	category: 'Staff',
	options: [
		{
			name: 'user',
			description: 'The user to search punishments for.',
			type: Options.User,
			required: true,
		},
		{
			name: 'type',
			description: 'Filter punishments by type.',
			type: Options.String,
			choices: [
				{ name: 'Warn', value: 'Warn' },
				{ name: 'Mute', value: 'Mute' },
				{ name: 'Unmute', value: 'Unmute' },
				{ name: 'Ban', value: 'Ban' },
				{ name: 'Unban', value: 'Unban' },
				{ name: 'Moderated Nickname', value: 'Moderated Nickname' },
				{ name: 'Changed Nickname', value: 'Changed Nickname' },
				{ name: 'Warn', value: 'Warn' },
				{ name: 'Blacklist', value: 'Blacklist' },
				{ name: 'Unblacklist', value: 'Unblacklist' },
			],
		},
		{
			name: 'staff',
			description: 'Only show punishments by a specific moderator.',
			type: Options.User,
		},
		{
			name: 'reason',
			description: 'Search for a string inside the punishments\'s reason.',
			type: Options.String,
		},
		{
			name: 'active',
			description:
				'Only include active/already expired punishments. Excludes punishments that lack this indicator.',
			type: Options.Boolean,
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
		const user = options.getUser('user', true);
		const type = options.getString('type');
		const staff = options.getUser('staff');
		const reason = options.getString('reason');
		const active = options.getBoolean('active');
		const logs = (await client.modlogs.getUser(user.id)).filter((l) => {
			return [
				type ? l.caseType === type : undefined,
				staff ? l.staffID === staff.id : undefined,
				reason
					? l.reason.toLowerCase().includes(reason.toLowerCase())
					: undefined,
				active ? l.isActive === active : undefined,
			].every((option) => option !== false);
		});
		if (!logs.length) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find any punshments matching your search.')],
			});
		}
		const fields = logs.map((l) => {
			return {
				name: `Punishment ID: ${l.punishID} (${l.caseType})`,
				value: `- **Reason:** ${l.reason}\n- **Punished by:** <@${
					l.staffID
				}> (${l.staffID})\n- **Created:** <t:${Math.floor(
					l.timestamp / 1000,
				)}:R> (<t:${Math.floor(l.timestamp / 1000)}:f>)\n${
					l.expires
						? (l.isActive !== false ? '- **Expires:**' : '- **Expired:**') +
						`<t:${Math.floor(l.expires / 1000)}:R> (<t:${Math.floor(
							l.expires / 1000,
						)}:f>)`
						: ''
				}`,
			};
		});
		const embeds = parsePages(
			fields,
			new MessageEmbed()
				.setTitle(`Punishment search for ${user.tag}`)
				.setDescription(`Found ${fields.length} results for ${user}.`)
				.setColor('GREEN'),
		);
		await pageMenu(interaction, embeds);
	},
};
