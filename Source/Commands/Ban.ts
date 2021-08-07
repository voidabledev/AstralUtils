import { Command } from '../Typings/Command';
import { MessageEmbed, Permissions, Guild, MessageButton, MessageActionRow, ButtonInteraction } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'ban',
	description: 'Bans a user.',
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
			description: 'The reason for this ban',
			required: true,
		},
	],
	async allowed(interaction, client) {
		return (interaction.guild && (interaction.member?.permissions as Readonly<Permissions>)?.has?.('BAN_MEMBERS')) ?? false;
	},
	async run(interaction, options, client) {

		const user = options.getUser('user', true);
		const reason = options.getString('reason', true);
		const time = options.getInteger('time');
		const timeUnit = options.getInteger('time-unit') ?? 60000;
		const member = await interaction.guild?.members.fetch(user.id);

		if (member?.bannable === false) {
			return interaction.reply({
				content: 'I can\'t ban this user!',
				ephemeral: true,
			});
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton().setLabel('Confirm').setStyle('SUCCESS').setCustomId('confirm-ban'),
				new MessageButton().setLabel('Cancel').setStyle('DANGER').setCustomId('cancel-ban'),
			);
		await interaction.reply({
			content: `Do you want to ban ${user} for \`${reason}\`?`,
			components: [row],
			ephemeral: true,
		});

		const confirmFilter = (i: ButtonInteraction) => i.customId === 'confirm-ban' && i.user.id === interaction.user.id;
		const cancelFilter = (i: ButtonInteraction) => i.customId === 'cancel-ban' && i.user.id === interaction.user.id;
		const confirmCollector = interaction.channel?.createMessageComponentCollector({ filter: confirmFilter, time: 15000 });
		const cancelCollector = interaction.channel?.createMessageComponentCollector({ filter: cancelFilter, time: 15000 });

		cancelCollector?.on('collect', async (i: ButtonInteraction) => {
			confirmCollector?.dispose(i);
			cancelCollector?.stop();
		});

		cancelCollector?.on('end', async () => {
			interaction.editReply({
				content: 'Cancelled.',
				components: [],
			});
		});

		confirmCollector?.on('collect', async (i) => {
			cancelCollector?.dispose(i);
			confirmCollector?.dispose(i);
			const userEmbed = new MessageEmbed()
				.setTitle(`You've been banned in **${interaction.guild?.name}**`)
				.addField('Reason', reason)
				.addField('Expires', time ? `<t:${Math.floor((new Date().getTime() + time * timeUnit) / 1000)}:R>` : 'Permanent')
				.setColor('RED');
			await user.send({
				embeds: [userEmbed],
			}).catch(() => { /* cannot send messages to this user */ });
			await interaction.guild?.members.ban(user, {
				reason,
			});
			const log = await client.modlogs.set({
				guildID: (interaction.guild as Guild).id,
				userID: user.id,
				staffID: interaction.user.id,
				reason,
				caseType: 'Ban',
				expires: time ? new Date().getTime() + time * timeUnit : undefined,
				isActive: true,
			});
			await interaction.editReply({
				content: `${user} has been **banned** | \`${log.punishID}\``,
				components: [],
			});
		});
	},
};
