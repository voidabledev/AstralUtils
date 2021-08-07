import { Command } from '../Typings/Command';
import { MessageEmbed, Permissions, Guild, MessageButton, MessageActionRow, ButtonInteraction } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'unban',
	description: 'Unans a user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to ban.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this unban',
			required: true,
		},
	],
	async allowed(interaction, client) {
		return (interaction.guild && (interaction.member?.permissions as Readonly<Permissions>)?.has?.('BAN_MEMBERS')) ?? false;
	},
	async run(interaction, options, client) {

		const user = options.getUser('user', true);
		const reason = options.getString('reason', true);

		if (!(await interaction.guild?.bans.fetch())?.find((b) => b.user.id === user.id)) {
			return interaction.reply({
				content: 'That user isn\'t banned!',
				ephemeral: true,
			});
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton().setLabel('Confirm').setStyle('SUCCESS').setCustomId('confirm-unban'),
				new MessageButton().setLabel('Cancel').setStyle('DANGER').setCustomId('cancel-unban'),
			);
		await interaction.reply({
			content: `Do you want to unban ${user.tag} for \`${reason}\`?`,
			components: [row],
			ephemeral: true,
		});

		const confirmFilter = (i: ButtonInteraction) => i.customId === 'confirm-unban' && i.user.id === interaction.user.id;
		const cancelFilter = (i: ButtonInteraction) => i.customId === 'cancel-unban' && i.user.id === interaction.user.id;
		const confirmCollector = interaction.channel?.createMessageComponentCollector({ filter: confirmFilter, time: 15000 });
		const cancelCollector = interaction.channel?.createMessageComponentCollector({ filter: cancelFilter, time: 15000 });
		let confirmed = false;

		cancelCollector?.on('collect', async () => {
			confirmCollector?.stop();
			cancelCollector?.stop();
		});

		cancelCollector?.on('end', async () => {
			if (!confirmed) {
				interaction.editReply({
					content: 'Cancelled.',
					components: [],
				});
			}
		});

		confirmCollector?.on('collect', async () => {
			confirmed = true;
			cancelCollector?.stop();
			confirmCollector?.stop();
			await interaction.guild?.members.unban(user, reason);
			const log = await client.modlogs.set({
				guildID: (interaction.guild as Guild).id,
				userID: user.id,
				staffID: interaction.user.id,
				reason,
				caseType: 'Unban',
			});
			await interaction.editReply({
				content: `${user.tag} has been **unbanned** | \`${log.punishID}\``,
				components: [],
			});
		});
	},
};
