import { Client } from '../modules/client';
import {
	Pattern as Giveaway,
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
import { fail } from '../modules/embeds';

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
		await interaction.reply({
			content: text,
		});
		const message = await interaction.fetchReply();
		const embed = new MessageEmbed()
			.setAuthor(`${data.prize}`)
			.setDescription(
				`This giveaway ends <t:${Math.floor(data.end / 1000)}:R>.`,
			)
			.addFields(
				{
					name: 'Giveaway Info',
					value: `**Hosted by:** <@${data.host}>\n${
						data.sponsor ? `**Sponsored by:** <@${data.sponsor}\n` : ''
					}**Winner Count:** ${data.winnerCount}`,
					inline: true,
				},
				{
					name: 'Requirement Info',
					value: `${data.requirement ?? 'None'}`,
				},
			)
			.setFooter(`Message ID: ${message.id}`)
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
		await interaction.editReply({
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
			this._client.guilds.cache
				.get(giveaway.guildId)
				?.channels.cache.get(giveaway.channelId) as
				| TextBasedChannels
				| undefined
		)?.messages.fetch(messageId);
		if (!message) throw new Error('GiveawayError: Unknown message');
		const embed = new MessageEmbed()
			.setAuthor(`${data.prize}`)
			.setDescription(
				`This giveaway ends <t:${Math.floor(giveaway.end / 1000)}:R>.`,
			)
			.addFields(
				{
					name: 'Giveaway Info',
					value: `**Hosted by:** <@${giveaway.host}>\n${
						giveaway.sponsor ? `**Sponsored by:** <@${giveaway.sponsor}\n` : ''
					}**Winner Count:** ${giveaway.winnerCount}`,
					inline: true,
				},
				{
					name: 'Requirement Info',
					value: `${giveaway.requirement ?? 'None'}`,
				},
			)
			.setFooter(`Message ID: ${message.id}`)
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
		if (giveaway.entries.includes(userId)) {
			return 'You have already entered this giveaway!';
		}
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
		return 'Entered!';
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
		const embed = new MessageEmbed()
			.setAuthor(`${giveaway.prize}`)
			.setDescription('This giveaway has **ended**.')
			.addFields(
				{
					name: 'Giveaway Info',
					value: `**Hosted by:** <@${giveaway.host}>\n${
						giveaway.sponsor ? `**Sponsored by:** <@${giveaway.sponsor}>\n` : ''
					}**Ended:** <t:${Math.floor(
						Date.now() / 1000,
					)}:R>\n **Winners:** ${winners.map((w) => `<@${w}>`).join(', ')}`,
				},
				{
					name: 'Requirement Info',
					value: `${giveaway.requirement ?? 'None'}`,
				},
			)
			.setFooter(`Message ID: ${message.id} | Winners: ${giveaway.winnerCount}`)
			.setColor('RED');
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
			) ||
			!(interaction.member?.roles as GuildMemberRoleManager).cache.find((r) =>
				r.name.endsWith('• Nitro Giveaways'),
			) ||
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
					.setDescription('This giveaway has **ended**.')
					.addFields(
						{
							name: 'Giveaway Info',
							value: `**Hosted by:** <@${giveaway.host}>\n${
								giveaway.sponsor
									? `**Sponsored by:** <@${giveaway.sponsor}>\n`
									: ''
							}**Ended:** <t:${Math.floor(
								Date.now() / 1000,
							)}:R>\n **Winners:** ${winners.map((w) => `<@${w}>`).join(', ')}`,
						},
						{
							name: 'Requirement Info',
							value: `${giveaway.requirement ?? 'None'}`,
						},
					)
					.setFooter(
						`Message ID: ${message.id} | Winners: ${giveaway.winnerCount}`,
					)
					.setColor('RED');
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
					content: `Congratulations ${mentions.join(', ')}, you have won **${
						giveaway.prize
					}**!`,
					components: [gRow],
				});
				await giveawayModel.updateOne({ messageId }, { winners });
				collectors.forEach((c) => c?.stop());
				cancel?.stop();
				setTimeout(() => collector?.stop(), 2000);
				resolve();
			});
			collector?.on('end', () => reject());
			cancel?.on('collect', () => reject());
		});
	}
}
