import { Client } from '../Modules/Client';
import { Pattern as Giveaway, giveawayModel, GiveawayData, CreateData } from '../Models/GiveawayModel';
import { CommandInteraction, MessageEmbed, TextBasedChannels, MessageActionRow, MessageButton, Message, ButtonInteraction, GuildMemberRoleManager, Permissions } from 'discord.js';
import { fail } from '../Modules/Embeds';
export class GiveawayManager {

	constructor(private _client: Client, interval: number) {
		this._client = _client;
	}

	async create(data: CreateData, text: string, interaction: CommandInteraction): Promise<Giveaway> {

		await interaction.reply({
			content: text,
		});
		const message = await interaction.fetchReply() as Message;

		const embed = new MessageEmbed()
			.setTitle(`<:bluedot:842408037502550106> **${data.prize}** <:bluedot:842408037502550106>`)
			.setDescription(
				`**Hosted by:** <@${data.host}>\n${
					data.sponsor ? `**Sponsored by:** <@${data.sponsor}\n` : ''
				}**Ends:** <t:${Math.floor(data.end / 1000)}:R>\n${
					data.requirement ? `**Requirement:** ${data.requirement}\n` : ''
				}`,
			)
			.setFooter(`Message ID: ${message.id} | Winners: ${data.winnerCount}`);
		const row = new MessageActionRow().addComponents(
			new MessageButton().setStyle('SUCCESS').setLabel('Enter').setCustomId(`enter-giveaway-${message.id}`),
			new MessageButton().setStyle('DANGER').setLabel('Control').setCustomId(`control-giveaway-${message.id}`),
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

	async update(messageId: string, data: CreateData, text?: string): Promise<Giveaway> {
		await giveawayModel.updateOne({ messageId }, data);
		const giveaway = await giveawayModel.findOne({ messageId });

		if (!giveaway) throw new Error('GiveawayError: Giveaway not found');

		const message = await (this._client.guilds.cache.get(giveaway.guildId)?.channels.cache.get(giveaway.channelId) as TextBasedChannels | undefined)?.messages.fetch(messageId);

		if (!message) throw new Error('GiveawayError: Unknown message');

		const embed = new MessageEmbed()
			.setTitle(`<:bluedot:842408037502550106> **${data.prize}** <:bluedot:842408037502550106>`)
			.setDescription(
				`**Hosted by:** <@${data.host}>\n${
					data.sponsor ? `**Sponsored by:** <@${data.sponsor}\n` : ''
				}**Ends:** <t:${Math.floor(data.end / 1000)}:R>\n${
					data.requirement ? `**Requirement:** ${data.requirement}\n` : ''
				}`,
			)
			.setFooter(`Message ID: ${message.id} | Winners: ${data.winnerCount}`);

		await message.edit({
			content: text ?? message.content,
			embeds: [embed],
		});

		return giveaway;
	}

	async enter(messageId: string, userId: string): Promise<Giveaway> {
		const giveaway = await giveawayModel.findOneAndUpdate({
			messageId,
		}, {
			$push: {
				entries: userId,
			},
		});

		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway');

		giveaway.entries.push(userId);
		return giveaway;
	}

	async end(messageId: string): Promise<Giveaway> {
		const giveaway = await giveawayModel.findOneAndUpdate({ messageId }, { ended: true });
		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway');

		giveaway.ended = true;
		// ! edit og message and send a follow-up
		return giveaway;
	}

	async displayControl(interaction: ButtonInteraction): Promise<void> {
		if (!interaction.customId.startsWith('control-giveaway-')) throw new Error('GiveawayError: couldn\'t find a giveaway associated to this interaction.');

		if (!(interaction.member?.roles as GuildMemberRoleManager).cache.find((r) => r.name.endsWith('Giveaways')) && !(interaction.member?.permissions as Readonly<Permissions>).has('MANAGE_MESSAGES')) {
			return interaction.reply({
				embeds: [fail('You don\'t have permission to view the control panel for this giveaway!')],
				ephemeral: true,
			});
		}

		const messageId = interaction.customId.replace('control-giveaway-', '');
		const message = await interaction.channel?.messages.fetch(messageId);
		const giveaway = await giveawayModel.findOne({ messageId });

		if (!giveaway) throw new Error('GiveawayError: Unknown giveaway.');
		if (!message) throw new Error('GiveawayError: Unknown message.');

		const embed = new MessageEmbed()
			.setTitle('Giveaway control panel')
			.setDescription('Use the buttons below to the giveaway.');
		const row = new MessageActionRow().addComponents(
			new MessageButton().setStyle('PRIMARY').setLabel('End').setCustomId(`giveaway-end-${messageId}`).setDisabled(giveaway.ended),
			new MessageButton().setStyle('PRIMARY').setLabel('Reroll').setCustomId(`giveaway-reroll-${messageId}`).setDisabled(!giveaway.ended),
			new MessageButton().setStyle('LINK').setLabel(`${giveaway.entries.length} entries`).setURL(message.url),
		);
		await interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
		});
	}
}