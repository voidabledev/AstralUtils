import { Command } from '../Typings/Command';
import { devs } from '../config.json';
import { MessageEmbed, PresenceStatusData, ActivityType } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'activity',
	description: 'Sets the bot\'s status.',
	options: [
		{
			type: Options.String,
			name: 'status',
			description: 'The bot\'s status.',
			choices: [
				{ name: 'Online', value: 'online' },
				{ name: 'Idle', value: 'idle' },
				{ name: 'DND (Do not disturb)', value: 'dnd' },
				{ name: 'Invisible', value: 'invisible' },
			],
		},
		{
			type: Options.String,
			name: 'type',
			description: 'Type of the activity.',
			choices: [
				{ name: 'Playing', value: 'PLAYING' },
				{ name: 'Streaming', value: 'STREAMING' },
				{ name: 'Listening to', value: 'LISTENING' },
				{ name: 'Watching', value: 'WATCHING' },
				{ name: 'Competing in', value: 'COMPETING' },
			],
		},
		{
			type: Options.String,
			name: 'name',
			description: 'Name of the activity.',
		},
		{
			type: Options.String,
			name: 'url',
			description: 'Stream URL',
		},
	],
	async allowed(interaction, client) {
		return devs.includes(interaction.user.id);
	},
	async run(interaction, options, client) {
		const status = (options.getString('status') as PresenceStatusData) ?? undefined;
		const type = (options.getString('type') as ActivityType) ?? undefined;
		const name = options.getString('name') ?? undefined;
		const url = options.getString('url') ?? undefined;
		try {
			client.user?.setPresence({
				status,
				activities: [{
					type,
					name,
					url,
				}],
			});
			interaction.reply({
				content: 'Status has been set!',
				ephemeral: true,
			});
		}
		catch(e) {
			interaction.reply({
				content: `Failed to set status:\n${e.message}`,
				ephemeral: true,
			});
		}
	},
};
