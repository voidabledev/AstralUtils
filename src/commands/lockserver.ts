/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../typings/command';
import { MessageEmbed, Permissions, GuildChannel, Collection } from 'discord.js';
import { success, fail, confirm } from '../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
const ignored = new Set<string>([
	'831996492347736075',
	'831996493161824267',
	'831996494604140589',
	'842425085910450236',
	'831996498412699668',
	'831996499989889074',
	'831996500816822333',
	'831996501298511923',
	'831996502553133204',
	'839231003864072192',
	'844293566972166144',
	'844065597562421249',
	'846735360050069506',
	'831996506282131546',
]);
const locked = new Collection<string, GuildChannel>();

export const command: Command = {
	name: 'lockserver',
	description: 'Lock the server down.',
	options: [
		{
			type: Options.String,
			name: 'reason',
			description:
				'Why this lockdown has been issued. Don\'t be a Boris Johnson!',
			required: true,
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_ROLES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const reason = options.getString('reason', true);
		if (!interaction.inGuild() || interaction.guild === null) return;
		const { guild } = interaction;

		await confirm(interaction, 'Are you sure you want to lock the server down?', true).then(() => {

			interaction.editReply({
				embeds: [success('Locking down the server now... Please wait...')],
				components: [],
			});

			guild.channels.cache.forEach((channel) => {
				if (
					channel.isThread() ||
					ignored.has(channel.parent?.id ?? '') ||
					ignored.has(channel.id) ||
					channel.permissionOverwrites.cache.has('SEND_MESSAGES')
				) {return;}
				channel.permissionOverwrites.create(guild.roles.everyone, {
					SEND_MESSAGES: false,
					CONNECT: false,
					SPEAK: false,
					USE_PUBLIC_THREADS: false,
					USE_PRIVATE_THREADS: false,
				});
				locked.set(channel.id, channel);
				if (channel.id === interaction.channelId || !channel.isText()) return;
				channel.send(
					channel.id === '831996525864419348'
						? `<a:error:849037573912657932> The server has been locked down for \`${reason}\`. Do NOT	DM Moderators about being muted, because you are NOT! More information will be posted in this channel.`
						: `<a:error:849037573912657932> The server is locked down for \`${reason}\`. Please refer to <#831996525864419348> for more information.`,
				);
			});

			interaction.editReply({ embeds: [success(`Locked down ${locked.size} channels.`)] });

		})
			.catch((e) => {
				console.log(e);
				interaction.editReply({ embeds: [fail('Cancelled.')], components: [] });
			});
	},
};
