import { Command } from '../Typings/Command';
import { MessageEmbed, GuildMember } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'userinfo',
	description: 'Get information on a user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to view information of.',
		},
	],
	async run(interaction, options, client) {
		const user = options.getUser('user') ?? interaction.user;
		const member: GuildMember | undefined =
			user.id === interaction.user.id
				? (interaction.member as GuildMember | null ?? undefined)
				: (options.getMember('user') as GuildMember | undefined);
		if (!interaction.guild) return;

		const roles = member
			? member.roles.cache
				.sort((a, b) => b.position - a.position)
				.map((role) => role.toString())
				.slice(0, -1)
			: [];

		const embed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.addFields(
				{ name: 'User ID', value: `${user.id}`, inline: true },
				{
					name: 'Joined Discord',
					value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: 'Joined Server',
					value: member?.joinedTimestamp
						? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
						: 'Not in server',
					inline: true,
				},
				{
					name: 'User Color',
					value: member ? `${member.displayHexColor}` : 'Not in server',
					inline: true,
				},
				{ name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
				{
					name: 'Highest Role',
					value: `${
						!member || member.roles.highest.id === interaction.guild.id
							? 'None'
							: member.roles.highest
					}`,
					inline: true,
				},
				{
					name: 'User Roles',
					value: `${
						roles.length > 10
							? `${roles.slice(0, 10).join(', ')} and ${
								roles.length - 10
							} more role${roles.length === 11 ? '' : 's'}...`
							: roles.length > 0
								? roles.join(', ')
								: 'None'
					}`,
					inline: false,
				},
			)
			.setColor(`${member?.displayHexColor || 'RANDOM'}`)
			.setFooter(interaction.guild.name)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
