import { Event } from '../typings/event';
import { Message, MessageEmbed, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, TextBasedChannels, EmojiResolvable } from 'discord.js';

export const categories: { name: string; description: string; guildId: string; categoryId: string; ping: string; emoji: EmojiResolvable }[] = [
	{
		name: 'General questions',
		description: 'For any general questions you may have towards our staff team',
		guildId: '831995980097388604',
		categoryId: '844293566972166144',
		ping: '@here',
		emoji: '❓',
	},
	{
		name: 'Partnership',
		description: 'Choose this option if you have a server and want to partner with us.',
		guildId: '831995980097388604',
		categoryId: '883694529432129597',
		ping: '@here',
		emoji: '🤝',
	},
	{
		name: 'Appeal',
		description: 'Choose this option if you feel like a punishment that was given to you was unfair or biased. A head moderator or above will handle your request, so please be patient.',
		guildId: '831995980097388604',
		categoryId: '883701093027155979',
		ping: '@here',
		emoji: '<:modAbuse:851921064170094592>',
	},
	{
		name: 'Administrators',
		description: 'Anything that you don\'t want our moderation team to handle, for example reporting a staff member. Please be patient as an admin may not be available to assist you instantly.',
		guildId: '831995980097388604',
		categoryId: '844065597562421249',
		ping: '@here',
		emoji: '<a:error:849037573912657932>',
	},
	{
		name: 'Developers',
		description: 'For any questions you have towards our bot developers, for example bug reports.',
		guildId: '831995980097388604',
		categoryId: '846735360050069506',
		ping: '@here',
		emoji: '<:AstralCoin:877583618770370582>',
	},
];

export const event: Event = {
	event: 'messageCreate',
	async run(client, message: Message) {
		if (message.guild) return;
		if (message.author.bot) return;
		if (message.partial) message = await message.fetch();
		const modmail = client.modmail.getByUser(message.author.id);
		const [blacklist] = await client.modlogs.fetch({ userID: message.author.id, caseType: 'Blacklist', isActive: true });
		if (blacklist) {
			await message.react('<a:no:836302929781981265>');
			return;
		}
		if (modmail) {
			const channel = <TextBasedChannels>(await client.channels.fetch(modmail.channelId));
			const embed = new MessageEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(message.content)
				.setColor('ORANGE')
				.setFooter('Message')
				.setTimestamp();
			if (message.attachments.first()) embed.setImage(message.attachments.first().proxyURL);
			const m1 = await channel.send({
				embeds: [],
			});
			await client.modmail.addMessage(channel.id, message.content + (message.attachments.first() ? `\n\n${message.attachments.first().proxyURL}` : ''), [message.id, m1.id], message.author.id);
			await message.react('<a:yes:836302807485251674>');
		}
		else {
			const embed = new MessageEmbed()
				.setAuthor('Modmail thread creation', message.author.displayAvatarURL({ dynamic: true }))
				.setDescription('Please select a topic for your modmail thread.')
				.addFields(categories.map((c) => {
					return {
						name: `${c.emoji} ${c.name}`,
						value: c.description,
						inline: false,
					};
				}));
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.addOptions(categories.map((c, i) => {
						return {
							emoji: c.emoji,
							label: c.name,
							description: 'More information in the above message',
							value: String(i),
						};
					}))
					.setCustomId(`select-modmail-topic-${message.author.id}`),
			);
			await message.reply({
				embeds: [embed],
				components: [row],
			});
			// handled by select menu event
		}
	},
};