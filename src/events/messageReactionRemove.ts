/* eslint-disable @typescript-eslint/no-unused-vars */
import { Event } from '../typings/event';
import { MessageReaction, User } from 'discord.js';

export const event: Event = {
	event: 'messageReactionRemove',
	async run(client, reaction: MessageReaction, user: User) {
		if (user.bot) return;
		if (reaction.partial) await reaction.fetch();
		if (reaction.message.partial) await reaction.message.fetch();
		client.snipes.reacted.set(reaction.message.channel.id, {
			reaction,
			user,
		});
	},
};