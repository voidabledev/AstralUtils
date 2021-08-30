/* eslint-disable @typescript-eslint/no-unused-vars */
import { Event } from '../typings/event';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export const event: Event = {
	event: 'messageDelete',
	async run(client, message: Message) {
		if (message.author.bot) return;
		client.snipes.set(message.channel.id, {
			content: message.content,
			author: message.author,
			image: message.attachments.first() ? message.attachments.first().proxyURL : null,
		});
	},
};