import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { id as genId } from './Utils';
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

	const id = genId(10, 5);
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

	const confirmFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id && i.customId === `confirm-${id}`;
	const cancelFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id && i.customId === `cancel-${id}`;

	const confirmCollector = interaction.channel?.createMessageComponentCollector({
		filter: confirmFilter,
		time: 15000,
	});
	const cancelCollector = interaction.channel?.createMessageComponentCollector({
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