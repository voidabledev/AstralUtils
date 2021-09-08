/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { success, fail, confirm } from '../../structures/embeds';
import { TextChannel } from 'discord.js';

export const command: Command = {
	name: 'claim',
	description: 'Claim a modmail thread.',
	category: 'Modmail',
	async run(interaction, options, client) {
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		if (modmail.staffId) {
			try {
				await confirm(interaction, `This thread is alread claimed by <@${modmail.staffId}>. Don't take it away from them unless they aren't responding for a longer period of time. Are you sure you still want to claim this thread?`);
			}
			catch (e) {
				return interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			}
		}
		await client.modmail.claim(interaction.channel.id, interaction.user.id);
		await (<TextChannel>interaction.channel).setTopic((<TextChannel>interaction.channel).topic.split('**Claimed:**')[0] + `**Claimed:** This thread is claimed by <@${interaction.user.id}>.`);
		interaction[interaction.replied ? 'editReply' : 'reply']({
			embeds: [success('You have claimed this thread.')],
			components: [],
		});
	},
};
