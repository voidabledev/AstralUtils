import { Command } from '../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { fail, pageMenu, parsePages } from '../modules/embeds';
import { Pattern as Modlog } from '../models/modlogModel';
import { MessageEmbed, Permissions } from 'discord.js';

export const command: Command = {
	name: 'searchstaff',
	description: 'Search all punishments a staff member has.',
	options: [
		{
			name: 'user',
			description: 'The staff member to search punishments for.',
			type: Options.User,
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
		const user = options.getUser('user') ?? interaction.user;
		const logs = await client.modlogs.fetch({ staffID: user.id });
		const day = 1000 * 60 * 60 * 24;
		const embed1 = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setDescription(`Punishment overview for ${user}`)
			.setColor('GREEN');
		const embed2 = new MessageEmbed()
			.setFooter(`User ID: ${user.id}`)
			.setColor('GREEN');
		const embeds = [embed1, embed2];
		const pages = [
			{
				Warnings: logs.filter((r) => r.caseType === 'Warn'),
				Mutes: logs.filter((r) => r.caseType === 'Mute'),
				Unmutes: logs.filter((r) => r.caseType === 'Unmute'),
				Bans: logs.filter((r) => r.caseType === 'Ban'),
				Unbans: logs.filter((r) => r.caseType === 'Unban'),
				Subtotal: logs.filter((r) =>
					['Warn', 'Mute', 'Unmute', 'Ban', 'Unban'].includes(r.caseType),
				),
			},
			{
				Blacklists: logs.filter((r) => r.caseType === 'Blacklist'),
				Unblacklists: logs.filter((r) => r.caseType === 'Unblacklist'),
				'Moderated Nicknames': logs.filter(
					(r) => r.caseType === 'Moderated Nickname',
				),
				'Changed Nicknames': logs.filter(
					(r) => r.caseType === 'Changed Nickname',
				),
				Total: logs,
			},
		];
		pages.forEach((page, i) => {
			let v: keyof typeof page;
			for (v in page) {
				embeds[i].addFields(
					{
						name: `${v}\n(last 7 days)`,
						value: (page[v] as Modlog[])
							.filter((l) => Date.now() - l.timestamp < 7 * day)
							.length.toString(),
						inline: true,
					},
					{
						name: `${v}\n(last 30 days)`,
						value: (page[v] as Modlog[])
							.filter((l) => Date.now() - l.timestamp < 30 * day)
							.length.toString(),
						inline: true,
					},
					{
						name: `${v}\n(all time)`,
						value: (page[v] as Modlog[]).length.toString(),
						inline: true,
					},
				);
			}
		});
		interaction.reply({ embeds });
	},
};
