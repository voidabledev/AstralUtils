/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	User,
	SnowflakeUtil,
	EmbedFieldData,
} from 'discord.js';
import { success, fail, confirm, parsePages, pageMenu } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'logs',
	description: 'Search or view modmail logs.',
	options: [
		{
			type: Options.Subcommand,
			name: 'search',
			description: 'Find all previous modmail threads by a user',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user to search for.',
					required: true,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'view',
			description: 'View the logs of a modmail thread.',
			options: [
				{
					type: Options.String,
					name: 'channel-id',
					description: 'The thread\'s channel ID.',
					required: true,
				},
			],
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_MESSAGES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const sub = options.getSubcommand(true);
		if (sub === 'search') {
			const user = options.getUser('user', true);
			const modmails = client.modmail.getPrevious(user.id);
			if (!modmails.size) {
				return interaction.reply({
					embeds: [fail('This user has no modmail threads.')],
				});
			}
			const fields: EmbedFieldData[] = modmails.map((m) => {
				return {
					name: `Channel ID: ${m.channelId}`,
					value: `**Opening message:** ${m.messages[0].content}\n**Time:** <t:${Math.floor(SnowflakeUtil.deconstruct(m.channelId).timestamp / 1000)}:R>`,
				};
			});
			const optionsEmbed = new MessageEmbed()
				.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
				.setDescription(`${user} has a total of ${modmails.size} modmail threads.`)
				.setColor('GREEN');
			const embeds = parsePages(fields, optionsEmbed);
			await pageMenu(interaction, embeds);
		}

		if (sub === 'view') {
			const channelId = options.getString('channel-id', true);
			const modmail = client.modmail.getByChannel(channelId);
			if (!modmail) {
				return interaction.reply({
					embeds: [fail('I couldn\'t find the modmail thread you requested.')],
				});
			}
			await interaction.guild.members.fetch();
			const user = (id: string): User | undefined => client.users.cache.get(id);
			const optionsEmbed = new MessageEmbed()
				.setAuthor(user(modmail.userId)?.tag ?? '<Unknown User>', user(modmail.userId)?.displayAvatarURL({ dynamic: true }))
				.setDescription(`This modmail thread has ${modmail.messages.length} messages and was opened <t:${Math.floor(SnowflakeUtil.deconstruct(modmail.channelId).timestamp / 1000)}:R>.`)
				.setColor('GREEN');
			const fields: EmbedFieldData[] = modmail.messages.map((m) => {
				return {
					name: `${user(m.author)?.tag ?? '<Unknown User>'} - <t:${Math.floor(SnowflakeUtil.deconstruct(m.messageIds[0]).timestamp / 1000)}:R>`,
					value: (!user(m.author) ? `<@${m.author}> - ` : '') + m.content,
				};
			});
			const embeds = parsePages(fields, optionsEmbed);
			await pageMenu(interaction, embeds);
		}
	},
};
