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
	name: 'delete',
	description: 'Deletes a previously sent message in a modmail thread.',
	options: [
		{
			type: Options.String,
			name: 'message-id',
			description: 'The ID of the message to be deleted.',
			required: true,
		},
	],
	async run(interaction, options, client) {
		const messageId = options.getString('message-id', true);
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		const msg = modmail.messages.find((m) => m.messageIds[1] === messageId);
		if (!msg) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find a message with that ID!')],
				ephemeral: true,
			});
		}
		const dmChannel = await (await client.users.fetch(modmail.userId)).createDM();
		await dmChannel.messages.delete(msg.messageIds[0]);
		await interaction.channel.messages.delete(msg.messageIds[1]);
		modmail.messages = modmail.messages.filter((m) => m.messageIds[1] !== messageId);
		await client.modmail.edit(interaction.channel.id, modmail);
		await interaction.reply({
			embeds: [success('The message has been deleted.')],
		});
	},
};
