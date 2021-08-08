import { Command } from '../Typings/Command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { fail, pageMenu, parsePages } from '../Modules/Embeds';
import { MessageEmbed, Permissions } from 'discord.js';

export const command: Command = {
	name: 'search',
	description: 'Search all punishments a user has.',
	options: [
		{
			name: 'user',
			description: 'The user to search punishments for.',
			type: Options.User,
			required: true,
		},
		{
			name: 'type',
			description: 'Filter punishments by type.',
			type: Options.String,
			choices: [
				{ name: 'Warn', value: 'Warn' },
				{ name: 'Mute', value: 'Mute' },
				{ name: 'Unmute', value: 'Unmute' },
				{ name: 'Ban', value: 'Ban' },
				{ name: 'Unban', value: 'Unban' },
				{ name: 'Moderated Nickname', value: 'Moderated Nickname' },
				{ name: 'Changed Nickname', value: 'Changed Nickname' },
				{ name: 'Warn', value: 'Warn' },
				{ name: 'Blacklist', value: 'Blacklist' },
				{ name: 'Unblacklist', value: 'Unblacklist' },
			],
		},
	],
	async allowed(interaction, client) {
		return (interaction.guild && (interaction.member?.permissions as Readonly<Permissions>)?.has?.('MANAGE_MESSAGES')) ?? false;
	},
	async run(interaction, options, client) {
		const user = options.getUser('user', true);
		const type = options.getString('type');
		const logs = (await client.modlogs.getUser(user.id)).filter((l) => type ? l?.caseType === type : true);

		if (!logs) {
			return interaction.reply({
				embeds: [fail(`I couldn't find any ${type ?? 'punishments'} for this user.`)],
			});
		}
		// TODO: finish this
	},
};