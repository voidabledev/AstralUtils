/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: fix this [throws api error: unknown channel]
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	TextBasedChannels,
} from 'discord.js';
import { success, fail, confirm } from '../../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'edit',
	description: 'Edits a previously sent message in a modmail thread.',
	options: [
		{
			type: Options.String,
			name: 'message-id',
			description: 'The ID of the message to be edited.',
			required: true,
		},
		{
			type: Options.String,
			name: 'content',
			description: 'The new message content.',
			required: true,
		},
	],
	async run(interaction, options, client) {
		const messageId = options.getString('message-id', true);
		const content = options.getString('content', true);
		const modmail = client.modmail.find((m) => m.messages.some((msg) => msg.messageIds[1] === messageId));
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		const i = modmail.messages.findIndex((m) => m.messageIds[1] === messageId);
		modmail.messages[i].content = content;
		const dmChannel = await client.channels.fetch(modmail.userId);
		const dmMsg = await (<TextBasedChannels>dmChannel).messages.fetch(modmail.messages[i].messageIds[0]);
		await dmMsg.edit(dmMsg.embeds[0] ? {
			embeds: [dmMsg.embeds[0].setDescription(content)],
		} : { content });
		const channelMsg = await interaction.channel.messages.fetch(modmail.messages[i].messageIds[1]);
		await channelMsg.edit({
			embeds: [channelMsg.embeds[0].setDescription(content)],
		});
		await client.modmail.edit(interaction.channel.id, modmail);
		await interaction.reply({
			embeds: [success('The message has been edited.')],
		});
	},
};
