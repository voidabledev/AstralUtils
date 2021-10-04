/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { success, fail, confirm } from '../../structures/embeds';
import { TextChannel } from 'discord.js';

export const command: Command = {
	name: 'subscribe',
	description: 'Get notified on every new message in a modmail thread.',
	async run(interaction, options, client) {
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		if (modmail.subscribers?.includes(interaction.user.id)) {
			return interaction.reply({
				embeds: [fail('You are already subscribed to this thread.')],
			});
		}
		await client.modmail.subscribe(modmail.channelId, interaction.user.id);
		return interaction.reply({
			embeds: [success('You will be notified on all new messages in this thread.')],
		});
	},
};
