import { Event } from '../typings/event';
import { Message, MessageEmbed, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, TextBasedChannels } from 'discord.js';

export const categories = [
	{
		name: 'Testing',
		description: 'A modmail sent to the testing server, for testing purposes only.',
		guildId: '849344562891063356',
		categoryId: '881930804056457216',
		ping: '<@538635176847343636>',
		emoji: '<:AstralCoin:877583618770370582>',
	},
	{
		name: 'General questions',
		description: 'For any general questions you may have towards our staff team',
		guildId: '831995980097388604',
		categoryId: '839231003864072192',
		ping: '@here',
		emoji: '❓',
	},
	{
		name: 'Partnership',
		description: 'Choose this option if you want to partner our server with yours.',
		guildId: '831995980097388604',
		categoryId: '839231003864072192',
		ping: '<@&831996436794310657>',
		emoji: '🤝',
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
			const m1 = await channel.send({
				embeds: [new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true })).setDescription(message.content).setColor('ORANGE').setFooter('Message').setTimestamp()],
			});
			await client.modmail.addMessage(channel.id, message.content, [message.id, m1.id], message.author.id);
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
							description: c.description,
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