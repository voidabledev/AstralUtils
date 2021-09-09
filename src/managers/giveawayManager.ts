/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '../structures/client';
import {
	GiveawayData as Giveaway,
	giveawayModel,
	UpdateData,
	CreateData,
} from '../models/giveawayModel';
import {
	CommandInteraction,
	MessageEmbed,
	TextBasedChannels,
	MessageActionRow,
	MessageButton,
	ButtonInteraction,
	GuildMemberRoleManager,
	Permissions,
	InteractionCollector,
	MessageComponentInteraction,
} from 'discord.js';
import { fail } from '../structures/embeds';

export class GiveawayManager {
	constructor(private _client: Client, interval: number) {
		this._client = _client;
		this._check(interval);
	}
	private async _check(interval: number): Promise<void> {
		setInterval(async () => {
			const giveaways = await giveawayModel.find({ ended: false });
			giveaways
				.filter((g) => g.end < Date.now())
				.forEach((g) => this.end(g.messageId));
		}, interval);
	}
	async create(
		data: CreateData,
		text: string,
		interaction: CommandInteraction,
	): Promise<Giveaway> {
		const message = await interaction.channel.send(text);
		const embed = new MessageEmbed()
			.setAuthor(`${data.prize}`)
			.setDescription(
				`**Ends:** <t:${Math.floor(data.end / 1000)}:R>.\n**Host:** <@${data.host}>\n${
					data.sponsor ? `**Sponsor:** <@${data.sponsor}>\n` : ''
				}**Requirement:** ${
					data.requirement ?? 'None'
				}\n**Claim Time:** ${data.claimTime ?? 'Automatic'}\n${
					data.notes ? `**Notes:** ${data.notes}` : ''
				}`,
			)
			.setFooter(`0 Entries | ${data.winnerCount} Winner${data.winnerCount > 1 ? 's' : ''}`)
			.setColor('RANDOM');
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Enter')
				.setCustomId(`enter-giveaway-${message.id}`),
			new MessageButton()
				.setStyle('DANGER')
				.setLabel('Control')
				.setCustomId(`control-giveaway-${message.id}`),
		);
		await message.edit({
			content: text,
			embeds: [embed],
			components: [row],
		});
		data.ended = false;
		data.messageId = message.id;
		data.entries = [];
		const giveaway = await giveawayModel.create(data);
		return giveaway;
	}
	async update(
		messageId: string,
		data: UpdateData,
		text?: string,
	): Promise<Giveaway> {
		data = Object.fromEntries(
			Object.entries(data).filter(([_, v]) => v !== undefined),
		);
		await giveawayModel.updateOne({ messageId }, data);
		const giveaway = await giveawayModel.findOne({ messageId });
		if (!giveaway) throw new Error('GiveawayError: Giveaway not found');
		const message = await (
			this._client.channels.cache.get(giveaway.channelId) as
				| TextBasedChannels
				| undefined
		)?.messages.fetch(messageId);
		if (!message) throw new Error('GiveawayError: Unknown message');
		const embed = new MessageEmbed()
			.setAuthor(`${giveaway.prize}`)
			.setDescription(
				`**Ends:** <t:${Math.floor(giveaway.end / 1000)}:R>.\n**Host:** <@${giveaway.host}>\n${
					giveaway.sponsor ? `**Sponsor:** <@${giveaway.sponsor}>\n` : ''
				}**Requirement:** ${
					giveaway.requirement ?? 'None'
				}\n**Claim Time:** ${giveaway.claimTime ?? 'Automatic'}\n${
					giveaway.notes ? `**Notes:** ${giveaway.notes}` : ''
				}`,
			)
			.setFooter(`${giveaway.entries.length} Entries | ${giveaway.winnerCount} Winner${giveaway.winnerCount > 1 ? 's' : ''}`)
			.setColor('RANDOM');
		await message.edit({
			content: text ?? message.content,
			embeds: [embed],
		});
		return giveaway;
	}
	async enter(messageId: string, userId: string): Promise<string> {
		const giveaway = await giveawayModel.findOne({
			messageId,
		});
		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway');
		let entered = true;
		if (giveaway.entries.includes(userId)) {
			giveaway.entries = giveaway.entries.filter((u) => u !== userId);
			await giveawayModel.updateOne(
				{
					messageId,
				},
				{
					$pull: {
						entries: userId,
					},
				},
			);
			entered = false;
		}
		else {
			giveaway.entries.push(userId);
			await giveawayModel.updateOne(
				{
					messageId,
				},
				{
					$push: {
						entries: userId,
					},
				},
			);
		}
		const message = await (<TextBasedChannels>this._client.channels.cache.get(giveaway.channelId)).messages.fetch(messageId);
		await message.edit({
			embeds: [message.embeds[0].setFooter(`${giveaway.entries.length} Entries | ${giveaway.winnerCount} Winners`)],
		});
		return entered ? 'You have successfully entered this giveaway.' : 'Your entry for this giveaway has been removed.';
	}
	async end(messageId: string): Promise<Giveaway> {
		const giveaway = await giveawayModel.findOne({ messageId });
		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway');
		const guild = this._client.guilds.cache.get(giveaway.guildId);
		if (!guild) throw new Error('GiveawayError: Unknown guild');
		const channel = guild.channels.cache.get(giveaway.channelId);
		if (!channel || !channel.isText()) {
			throw new Error('GiveawayError: Unknown channel');
		}
		const message = await channel.messages.fetch(giveaway.messageId);
		if (!message) throw new Error('GiveawayError: Unknown message');
		const winners: string[] = [];
		for (
			let i = 0;
			i < Math.min(giveaway.winnerCount, giveaway.entries.length);
			i++
		) {
			winners.push(
				giveaway.entries.splice(
					Math.floor(Math.random() * giveaway.entries.length),
					1,
				)[0],
			);
		}
		await giveawayModel.updateOne(
			{ messageId },
			{ ended: true, end: Date.now(), winners },
		);
		giveaway.end = Date.now();
		const embed = new MessageEmbed()
			.setAuthor(`${giveaway.prize}`)
			.setDescription(
				`**Ended:** <t:${Math.floor(giveaway.end / 1000)}:R>.\n**Host:** <@${giveaway.host}>\n${
					giveaway.sponsor ? `**Sponsor:** <@${giveaway.sponsor}>\n` : ''
				}**Requirement:** ${
					giveaway.requirement ?? 'None'
				}\n**Claim Time:** ${giveaway.claimTime ?? 'Automatic'}\n${
					giveaway.notes ? `**Notes:** ${giveaway.notes}\n` : ''
				}\n**Winners:** <@${winners.join('>, <@')}>`,
			)
			.setFooter(`${giveaway.entries.length} Entries | ${giveaway.winnerCount} Winner${giveaway.winnerCount > 1 ? 's' : ''}`)
			.setColor('RANDOM');
		const initialRow = message.components[0];
		initialRow?.components[0].setDisabled(true);
		await message.edit({
			content: ':tada: **This giveaway has ended** :tada:',
			embeds: [embed],
			components: [initialRow],
		});
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('DANGER')
				.setLabel('Control')
				.setCustomId(`control-giveaway-${giveaway.messageId}`),
			new MessageButton()
				.setStyle('LINK')
				.setURL(message.url)
				.setLabel(`${giveaway.entries.length + winners.length} entries`),
		);
		await channel.send({
			content: `Congratulations ${winners
				.map((w) => `<@${w}>`)
				.join(', ')}, you have won **${giveaway.prize}**!`,
			components: [row],
		});
		giveaway.ended = true;
		return giveaway;
	}
	async delete(messageId: string): Promise<Giveaway | undefined> {
		const giveaway = await giveawayModel.findOneAndDelete({ messageId });
		if (!giveaway) return undefined;
		const message = await (
			this._client.guilds.cache
				.get(giveaway.guildId)
				?.channels.cache.get(giveaway.channelId) as
				| TextBasedChannels
				| undefined
		)?.messages.fetch(messageId);
		if (message) message.delete();
		return giveaway;
	}
	async displayControl(interaction: ButtonInteraction): Promise<void> {
		if (!interaction.customId.startsWith('control-giveaway-')) {
			throw new Error(
				'GiveawayError: couldn\'t find a giveaway associated to this interaction.',
			);
		}
		if (
			!(interaction.member?.roles as GuildMemberRoleManager).cache.find((r) =>
				r.name.endsWith('• Giveaways'),
			) &&
			!(interaction.member?.roles as GuildMemberRoleManager).cache.find((r) =>
				r.name.endsWith('• Nitro Giveaways'),
			) &&
			!(interaction.member?.permissions as Readonly<Permissions>).has(
				'MANAGE_MESSAGES',
			)
		) {
			return interaction.reply({
				embeds: [
					fail(
						'You don\'t have permission to view the control panel for this giveaway!',
					),
				],
				ephemeral: true,
			});
		}
		const messageId = interaction.customId.replace('control-giveaway-', '');
		const message = await interaction.channel?.messages.fetch(messageId);
		const giveaway = await giveawayModel.findOne({ messageId });
		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway.');
		if (!message) throw new Error('GiveawayError: Unknown message.');
		const embed = new MessageEmbed()
			.setTitle('Giveaway Control Panel')
			.setDescription('Use the buttons below to control the giveaway.');
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('End')
				.setCustomId(`end-giveaway-${messageId}`)
				.setDisabled(giveaway.ended),
			new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Reroll')
				.setCustomId(`reroll-giveaway-${messageId}`)
				.setDisabled(!giveaway.ended),
			new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Delete')
				.setCustomId(`delete-giveaway-${messageId}`),
			new MessageButton()
				.setStyle('LINK')
				.setLabel(`${giveaway.entries.length} entries`)
				.setURL(message.url),
		);
		await interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
		});
	}
	async reroll(
		messageId: string,
		interaction: ButtonInteraction,
	): Promise<void> {
		const giveaway = await giveawayModel.findOne({ messageId });
		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway');
		if (!giveaway.ended || !giveaway.winners?.length) {
			throw new Error('GiveawayError: Giveaway is not ended');
		}
		const guild = this._client.guilds.cache.get(giveaway.guildId);
		if (!guild) throw new Error('GiveawayError: Unknown guild');
		const channel = guild.channels.cache.get(giveaway.channelId);
		if (!channel || !channel.isText()) {
			throw new Error('GiveawayError: Unknown channel');
		}
		const message = await channel.messages.fetch(giveaway.messageId);
		if (!message) throw new Error('GiveawayError: Unknown message');
		const row = new MessageActionRow();
		const row2 = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirm')
				.setCustomId(`reroll-confirm-${messageId}`),
			new MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancel')
				.setCustomId(`reroll-cancel-${messageId}`),
		);
		const embed = new MessageEmbed()
			.setDescription('Select/Unselect the members to reroll below.')
			.setColor('GREEN');
		for (const w of giveaway.winners) {
			const user = await this._client.users.fetch(w);
			row.addComponents(
				new MessageButton()
					.setStyle('PRIMARY')
					.setLabel(user.tag)
					.setCustomId(`reroll-select-${w}`),
			);
		}
		await interaction.reply({
			embeds: [embed],
			components: [row, row2],
			ephemeral: true,
		});
		async function updateButtons() {
			await interaction.editReply({
				components: [row, row2],
				embeds: [embed],
			});
		}
		const collectors: (
			| InteractionCollector<MessageComponentInteraction>
			| undefined
		)[] = [];
		row.components.forEach((c) => {
			if (!(c instanceof MessageButton)) return;
			const collector = interaction.channel?.createMessageComponentCollector({
				filter: (i) =>
					i.customId === c.customId && i.user.id === interaction.user.id,
				time: 60000,
			});
			collector?.on('collect', async (i) => {
				await i.deferUpdate();
				if (c.style === 'PRIMARY') c.setStyle('SECONDARY');
				else c.setStyle('PRIMARY');
				updateButtons();
			});
			collectors.push(collector);
		});
		return new Promise<void>((resolve, reject) => {
			const collector = interaction.channel?.createMessageComponentCollector({
				filter: (i) =>
					i.customId === row2.components[0].customId &&
					i.user.id === interaction.user.id,
				time: 60000,
			});
			const cancel = interaction.channel?.createMessageComponentCollector({
				filter: (i) =>
					i.customId === row2.components[1].customId &&
					i.user.id === interaction.user.id,
				time: 60000,
			});
			collector?.on('collect', async (i) => {
				await i.deferUpdate();
				const rerolls = row.components
					.filter((c) => c instanceof MessageButton && c.style === 'PRIMARY')
					.map((c) => c.customId?.replace('reroll-select-', ''));
				if (!rerolls.length) {
					collector?.stop();
					return;
				}
				const winners =
					giveaway.winners?.filter((e) => !rerolls.includes(e)) ?? [];
				const mentions: string[] = [];
				giveaway.entries = giveaway.entries.filter((e) => !winners.includes(e));
				for (let j = 0; j < rerolls.length; j++) {
					const entry = giveaway.entries.splice(
						Math.floor(Math.random() * giveaway.entries.length),
						1,
					)[0];
					winners.push(entry);
					mentions.push(`<@${entry}>`);
				}
				const gEmbed = new MessageEmbed()
					.setAuthor(`${giveaway.prize}`)
					.setDescription(
						`**Ended:** <t:${Math.floor(giveaway.end / 1000)}:R>.\n**Host:** <@${giveaway.host}>\n${
							giveaway.sponsor ? `**Sponsor:** <@${giveaway.sponsor}>\n` : ''
						}**Requirement:** ${
							giveaway.requirement ?? 'None'
						}\n**Claim Time:** ${giveaway.claimTime ?? 'Automatic'}\n${
							giveaway.notes ? `**Notes:** ${giveaway.notes}\n` : ''
						}\n**Winners:** <@${winners.join('>, <@')}>`,
					)
					.setFooter(`${giveaway.entries.length} Entries | ${giveaway.winnerCount} Winner${giveaway.winnerCount > 1 ? 's' : ''}`)
					.setColor('RANDOM');
				await message.edit({ embeds: [gEmbed] });
				const gRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setStyle('DANGER')
						.setLabel('Control')
						.setCustomId(`control-giveaway-${giveaway.messageId}`),
					new MessageButton()
						.setStyle('LINK')
						.setURL(message.url)
						.setLabel(`${giveaway.entries.length + winners.length} entries`),
				);
				await channel.send({
					content: `The new winners are ${mentions.join(', ')}, congratulations!`,
					components: [gRow],
				});
				await giveawayModel.updateOne({ messageId }, { winners });
				collectors.forEach((c) => c?.stop());
				cancel?.stop();
				setTimeout(() => collector?.stop(), 1000);
				resolve();
			});
			collector?.on('end', () => reject());
			cancel?.on('collect', () => reject());
		});
	}
}
