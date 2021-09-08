/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'close',
	description: 'Closes a modmail thread.',
	category: 'Modmail',
	options: [
		{
			type: Options.Integer,
			name: 'timeout',
			description: 'Specify a timeout after which the thread will be closed.',
		},
		{
			type: Options.Integer,
			name: 'timeout-unit',
			description: 'The time unit the timeout is specified in (default: seconds)',
			choices: [
				{ name: 'Second(s)', value: 1000 },
				{ name: 'Minute(s)', value: 1000 * 60 },
				{ name: 'Hour(s)', value: 1000 * 60 * 60 },
				{ name: 'Day(s)', value: 1000 * 60 * 60 * 24 },
			],
		},
	],
	async run(interaction, options, client) {
		const time = Math.max(options.getInteger('timeout') ?? 0, 0) * (options.getInteger('timeout-unit') ?? 1000);
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		const user = await client.users.fetch(modmail.userId);
		await interaction.reply({
			embeds: [success(time === 0 ? 'Closing thread now...' : `This thread will close <t:${Math.floor((Date.now() + time) / 1000)}:R>.`)],
		});
		setTimeout(async () => {
			await user?.send({
				embeds: [new MessageEmbed()
					.setDescription('This thread has been closed. Replying to this message will create a new thread.')
					.setFooter(`Closed by ${interaction.user.tag}`)
					.setTimestamp(),
				],
			}).catch(() => null);
			await client.modmail.close(interaction.channel.id);
			await interaction.channel.delete();
		}, time);
	},
};
