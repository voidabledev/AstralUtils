/* eslint-disable @typescript-eslint/no-unused-vars */
import { Event } from '../typings/event';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export const event: Event = {
	event: 'messageDelete',
	async run(client, message: Message) {
		if (message.partial) await message.fetch();
		if (message.author.bot) return;
		client.snipes.deleted.set(message.channel.id, message);
	},
};