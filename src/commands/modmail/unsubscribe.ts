/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { success, fail, confirm } from '../../structures/embeds';
import { TextChannel } from 'discord.js';

export const command: Command = {
	name: 'unsubscribe',
	description: 'Revoke a previous thread subscription.',
	async run(interaction, options, client) {
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		if (!modmail.subscribers?.includes(interaction.user.id)) {
			return interaction.reply({
				embeds: [fail('You aren\'t subscribed to this thread.')],
			});
		}
		await client.modmail.unsubscribe(modmail.channelId, interaction.user.id);
		return interaction.reply({
			embeds: [success('You will no longer receive notifications for this thread.')],
		});
	},
};
