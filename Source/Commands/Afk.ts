import { Command } from '../Typings/Command';
import { success } from '../Modules/Embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { GuildMember } from 'discord.js';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'afk',
	description: 'Marks you as AFK.',
	options: [
		{
			type: Options.String,
			name: 'message',
			description: 'Your AFK message',
			required: true,
		},
	],
	async run(interaction, options, client) {
		const message = options.getString('message', true);

		if (!interaction.member) return;

		client.afk.set(interaction.member as GuildMember, message);

		return interaction.reply({
			embeds: [success(`Your AFK message has been set: \`${message}\``)],
		});
	},
};
