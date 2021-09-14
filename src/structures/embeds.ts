import {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	InteractionCollector,
	Message,
	MessageComponentInteraction,
} from 'discord.js';

export function success(message: string, footer?: string): MessageEmbed {
	const embed = new MessageEmbed()
		.setDescription(`<a:yes:836302807485251674> ${message}`)
		.setColor('GREEN');
	if (footer) embed.setFooter(footer);
	return embed;
}

export function fail(message: string, footer?: string): MessageEmbed {
	const embed = new MessageEmbed()
		.setDescription(`<a:no:836302929781981265> ${message}`)
		.setColor('RED');
	if (footer) embed.setFooter(footer);
	return embed;
}

export async function confirm(
	interaction: CommandInteraction,
	prompt: string,
	ephemeral?: boolean,
	user?: string,
): Promise<void> {
	const replyFn =
		interaction.deferred || interaction.replied ? 'editReply' : 'reply';
	ephemeral ??= false;
	const { id } = interaction;
	const promptEmbed = new MessageEmbed()
		.setDescription(`<a:loading:855829253429264405> ${prompt}`)
		.setColor('ORANGE');
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel('Confirm')
			.setStyle('SUCCESS')
			.setCustomId(`confirm-${id}`),
		new MessageButton()
			.setLabel('Cancel')
			.setStyle('DANGER')
			.setCustomId(`cancel-${id}`),
	);
	await interaction[replyFn]({
		embeds: [promptEmbed],
		components: [row],
		ephemeral,
	});
	const message = ephemeral ? null : (await interaction.fetchReply() as Message);
	const confirmFilter = (i: ButtonInteraction) =>
		i.user.id === (user ?? interaction.user.id) && i.customId === `confirm-${id}`;
	const cancelFilter = (i: ButtonInteraction) =>
		i.user.id === (user ?? interaction.user.id) && i.customId === `cancel-${id}`;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const confirmCollector = (message ?? interaction.channel!).createMessageComponentCollector({
		filter: confirmFilter,
		time: 15000,
	});
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const cancelCollector = (message ?? interaction.channel!).createMessageComponentCollector({
		filter: cancelFilter,
		time: 15000,
	});
	return new Promise<void>((resolve, reject) => {
		confirmCollector.on('collect', async (i) => {
			await i.deferUpdate();
			confirmCollector.stop();
			resolve();
		});
		cancelCollector.on('collect', async (i) => {
			await i.deferUpdate();
			cancelCollector.stop();
			reject();
		});
		cancelCollector.on('end', () => {
			reject();
		});
	});
}

export async function pageMenu(
	interaction: CommandInteraction,
	pages: MessageEmbed[],
): Promise<void> {
	if (!pages.length) throw new Error('Cannot make an empty page menu');
	const { id } = interaction;
	const replyFn =
		interaction.deferred || interaction.replied ? 'editReply' : 'reply';
	let page = 0;
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('874288086048206899')
			.setCustomId(`first-${id}`)
			.setDisabled(page === 0),
		new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('874288033002840125')
			.setCustomId(`back-${id}`)
			.setDisabled(page === 0),
		new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('874287989746966588')
			.setCustomId(`next-${id}`)
			.setDisabled(page === pages.length - 1),
		new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('874288058877480981')
			.setCustomId(`last-${id}`)
			.setDisabled(page === pages.length - 1),
		new MessageButton()
			.setStyle('DANGER')
			.setEmoji('836302929781981265')
			.setCustomId(`end-${id}`),
	);
	await interaction[replyFn]({
		embeds: [pages[page]],
		components: [row],
	});
	const message = (await interaction.fetchReply()) as Message;
	const collectors: InteractionCollector<MessageComponentInteraction>[] = [];
	row.components.forEach((comp) => {
		const collector = message.createMessageComponentCollector({
			filter: (i) =>
				i.user.id === interaction.user.id && i.customId === comp.customId,
			time: 60000,
		});
		collectors.push(collector);
	});
	async function updateButtons() {
		row.components[0].setDisabled(page === 0);
		row.components[1].setDisabled(page === 0);
		row.components[2].setDisabled(page === pages.length - 1);
		row.components[3].setDisabled(page === pages.length - 1);
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
	collectors[4].on('collect', async (i) => {
		await i.deferUpdate();
		collectors.forEach((c) => c.stop());
	});
	return new Promise<void>((resolve) => {
		collectors[0].on('end', async () => {
			await interaction.editReply({
				components: [],
			});
			resolve();
		});
	});
}

export function parsePages(
	fields: { name: string; value: string }[],
	options: MessageEmbed,
): MessageEmbed[] {
	const maxPage = Math.floor((fields.length - 1) / 10);
	const pages = new Array<MessageEmbed>(maxPage + 1);
	let i = 0;
	while (i <= maxPage) {
		pages[i] = new MessageEmbed(options);
		pages[i]
			.setFooter(`Page ${i + 1}/${maxPage + 1}`)
			.spliceFields(
				0,
				pages[i].fields.length,
				fields.slice(10 * i, 10 * (i + 1)),
			);
		i++;
	}
	return pages;
}
