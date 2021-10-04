/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { success, fail, confirm } from '../../structures/embeds';
import { TextChannel } from 'discord.js';

export const command: Command = {
	name: 'notify',
	description: 'Get notified on the next message in a modmail thread.',
	async run(interaction, options, client) {
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		if (modmail.notify?.includes(interaction.user.id)) {
			return interaction.reply({
				embeds: [fail('You already have a pending notification in this thread!')],
			});
		}
		if (modmail.subscribers?.includes(interaction.user.id)) {
			return interaction.reply({
				embeds: [fail('You are subscribed to this thread.')],
			});
		}
		await client.modmail.addNotify(modmail.channelId, interaction.user.id);
		return interaction.reply({
			embeds: [success('You will be notified on the next message received.')],
		});
	},
};
