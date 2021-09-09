import { Event } from '../typings/event';
import { GuildMember, MessageEmbed } from 'discord.js';

export const event: Event = {
	event: 'guildMemberAdd',
	once: true,
	async run(client, member: GuildMember) {
		const userEmbed = new MessageEmbed()
			.setAuthor('Welcome to Astral Galaxy!', member.guild.iconURL({ dynamic: true }))
			.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n> Welcome to our server. We are a chill and strictly SFW community server. We offer frequent giveaways and events which may include nitro as prizes. Make sure to read the <#831996507116011621> and grab some <#831996509993697310> to get started! Reply to this message if you have any questions, a staff member will be here to assist you.\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n**Ban Appeal Form:**\n> https://forms.gle/rWqNKMV4GnA6LC5d9\n**Permanent Invite Link:**\n> https://discord.gg/8HnfNaXP9m\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
			.setFooter('Welcome to our galaxy and enjoy your stay!', member.guild.iconURL({ dynamic: true }))
			.setColor('#0062FF');
		await member.user.send({ embeds: [userEmbed] }).catch(() => null);

		const channelEmbed = new MessageEmbed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`Welcome **${member.user.username}** to **${member.guild.name}**! Make sure to read the <#831996507116011621> and grab some <#831996509993697310>. We hope you enjoy your stay here.`)
			.setFooter(`Member #${member.guild.memberCount}`, member.guild.iconURL({ dynamic: true }))
			.setColor('BLURPLE');
		const channel = member.guild.channels.cache.find((c) => c.name.endsWith('general'));
		if (!channel || !channel.isText()) return;
		await channel.send({ content: `${member.user}`, embeds: [channelEmbed] }).catch(() => null);
	},
};
