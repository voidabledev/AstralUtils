/* eslint-disable @typescript-eslint/no-unused-vars */
import { Event } from '../typings/event';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export const event: Event = {
	event: 'messageUpdate',
	async run(client, oldMessage: Message, newMessage: Message) {
		if (oldMessage.partial) await oldMessage.fetch();
		if (newMessage.partial) await newMessage.fetch();
		if (newMessage.author.bot) return;
		client.snipes.edited.set(oldMessage.channel.id, [oldMessage, newMessage]);

		if (newMessage.channel.type === 'DM') {
			const modmail = client.modmail.getByUser(newMessage.author.id);
			if (!modmail) return;
			const i = modmail.messages.findIndex((m) => m.messageIds[0] === newMessage.id);
			const channel: TextChannel = <TextChannel>client.channels.cache.get(modmail.channelId);
			const msg = await channel.messages.fetch(modmail.messages[i].messageIds[1]);
			const embed = msg.embeds[0];
			embed.fields.unshift({ name: 'Edited, former message:', value: oldMessage.content, inline: false });
			embed.setDescription(newMessage.content);
			await msg.edit({ embeds: [embed] });
			modmail.messages[i].content = newMessage.content;
			await client.modmail.edit(modmail.channelId, modmail);
		}
	},
};