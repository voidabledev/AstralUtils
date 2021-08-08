import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, InteractionCollector, Message, MessageComponentInteraction, MessageEmbedOptions } from 'discord.js';
// TODO: Implement these embeds into commands
export function success(message: string, footer?: string): MessageEmbed {
	const embed = new MessageEmbed()
		.setDescription(`<a:yes:836302807485251674> ${message}`)
		.setColor('GREEN');
	if(footer) embed.setFooter(footer);
	return embed;
}

export function fail(message: string, footer?: string): MessageEmbed {
	const embed = new MessageEmbed()
		.setDescription(`<a:no:836302929781981265> ${message}`)
		.setColor('RED');
	if(footer) embed.setFooter(footer);
	return embed;
}

export async function confirm(
	interaction: CommandInteraction,
	prompt: string,
	ephemeral?: boolean,
): Promise<void> {
	const replyFn = interaction.deferred || interaction.replied ? 'editReply' : 'reply';
	ephemeral ??= false;
	const { id } = interaction;
	const promptEmbed = new MessageEmbed()
		.setDescription(`<a:loading:855829253429264405> ${prompt}`)
		.setColor('ORANGE');
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton().setLabel('Confirm').setStyle('SUCCESS').setCustomId(`confirm-${id}`),
			new MessageButton().setLabel('Cancel').setStyle('DANGER').setCustomId(`cancel-${id}`),
		);

	await interaction[replyFn]({
		embeds: [promptEmbed],
		components: [row],
		ephemeral,
	});

	const message = (await interaction.fetchReply() as Message);

	const confirmFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id && i.customId === `confirm-${id}`;
	const cancelFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id && i.customId === `cancel-${id}`;

	const confirmCollector = message.createMessageComponentCollector({
		filter: confirmFilter,
		time: 15000,
	});
	const cancelCollector = message.createMessageComponentCollector({
		filter: cancelFilter,
		time: 15000,
	});
	return new Promise<void>((resolve, reject) => {
		confirmCollector?.on('collect', async (i) => {
			await i.deferUpdate();
			resolve();
		});
		cancelCollector?.on('collect', async (i) => {
			await i.deferUpdate();
			reject();
		});
		cancelCollector?.on('end', () => {
			reject();
		});
	});
}

export async function pageMenu(interaction: CommandInteraction, pages: MessageEmbed[]): Promise<void> {
	if (!pages.length) throw new Error('Cannot make an empty page menu');
	const { id } = interaction;
	const replyFn = interaction.deferred || interaction.replied ? 'editReply' : 'reply';
	let page = 0;
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton().setStyle('SECONDARY').setEmoji('⏪').setCustomId(`first-${id}`).setDisabled(true),
			new MessageButton().setStyle('SECONDARY').setEmoji('◀').setCustomId(`back-${id}`).setDisabled(true),
			new MessageButton().setStyle('SECONDARY').setEmoji('▶').setCustomId(`next-${id}`),
			new MessageButton().setStyle('SECONDARY').setEmoji('⏩').setCustomId(`last-${id}`),
		);
	await interaction[replyFn]({
		embeds: [pages[page]],
		components: [row],
	});
	const message = (await interaction.fetchReply()) as Message;
	const collectors: InteractionCollector<MessageComponentInteraction>[] = [];
	row.components.forEach((comp) => {
		const collector = message.createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id && i.customId === comp.customId,
			time: 60000,
		});
		collectors.push(collector);
	});
	async function updateButtons() {
		row.components[0].setDisabled(page !== 0);
		row.components[1].setDisabled(page !== 0);
		row.components[2].setDisabled(page !== pages.length - 1);
		row.components[3].setDisabled(page !== pages.length - 1);
		await interaction.editReply({
			embeds: [pages[page]],
			components: [row],
		});
	}
	collectors[0].on('collect', async (i) => {
		await i.deferUpdate();
		page = 0;
		await updateButtons();
	});
	collectors[1].on('collect', async (i) => {
		await i.deferUpdate();
		page--;
		await updateButtons();
	});
	collectors[2].on('collect', async (i) => {
		await i.deferUpdate();
		page++;
		await updateButtons();
	});
	collectors[3].on('collect', async (i) => {
		await i.deferUpdate();
		page = pages.length - 1;
		await updateButtons();
	});
}

export function parsePages(fields: { name: string, value: string }[], options: MessageEmbedOptions): MessageEmbed[] {
	function page(index: number): number {
		return Math.floor(index / 25);
	}
	const embeds: MessageEmbed[] = [];
	embeds.fill(new MessageEmbed(options), 0, page(fields.length));
	embeds.forEach((e, i) => {
		e.setFooter(`Page ${i + 1}/${page(fields.length)}`);
		e.addFields(fields.filter((_, j) => page(j) === i));
	});
	return embeds;
}