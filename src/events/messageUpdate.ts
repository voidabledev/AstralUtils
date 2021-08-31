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
	},
};