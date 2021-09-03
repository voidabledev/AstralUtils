/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
	GuildMemberRoleManager,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'reply',
	description: 'Replies to a modmail thread.',
	options: [
		{
			type: Options.String,
			name: 'content',
			description: 'The message to reply with.',
			required: true,
		},
		{
			type: Options.Boolean,
			name: 'anon',
			description: 'Whether or not to reply anonymously (default: true)',
		},
		{
			type: Options.Boolean,
			name: 'plain',
			description: 'Whether or not to reply with a plain message instead of an embed (default: false)',
		},
	],
	async run(interaction, options, client) {
		const content = options.getString('content', true);
		const anon = options.getBoolean('anon') ?? true;
		const plain = options.getBoolean('plain') ?? false;

		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		if (modmail.staffId && modmail.staffId !== interaction.user.id) {
			return interaction.reply({
				embeds: [fail(`This thread is claimed by <@${modmail.staffId}>! You can't reply to it unless you claim it for yourself!`)],
			});
		}
		const user = await client.users.fetch(modmail.userId);
		let m1;
		try {
			m1 = await user.send(!plain ? {
				embeds: [
					new MessageEmbed()
						.setAuthor(
							anon ? 'Support Team' : interaction.user.tag,
							anon ? interaction.guild.iconURL({ dynamic: true }) : interaction.user.displayAvatarURL({ dynamic: true }),
						)
						.setDescription(content)
						.setFooter('Response')
						.setTimestamp()
						.setColor('GREEN'),
				],
			} : {
				content: anon ? `*Support Team:*\n${content}` : `*${interaction.user.tag}:*\n${content}`,
			});
		}
		catch (e) {
			return interaction.reply({
				embeds: [fail(`I was unable to send a message to ${user}!`)],
			});
		}

		const m2 = await interaction.reply({
			embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true })).setDescription(content).setColor('GREEN').setFooter(`${plain ? 'Plain ' : ''}${anon ? 'Anonymous ' : ''}Reply`).setTimestamp()],
			fetchReply: true,
		});
		await client.modmail.addMessage(modmail.channelId, content, [m1.id, m2.id], interaction.user.id);
	},
};
