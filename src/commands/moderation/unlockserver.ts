/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	Permissions,
	GuildChannel,
	Collection,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
const locked = new Collection<string, GuildChannel>();
const ignored = new Set<string>([
	'831996492347736075',
	'831996493161824267',
	'831996494604140589',
	'831996540436086884',
	'831996541501308939',
	'831996498412699668',
	'876401218174459944',
	'831996499989889074',
	'831996500816822333',
	'870079202882379817',
	'831996502553133204',
	'839231003864072192',
	'844293566972166144',
	'883694529432129597',
	'883701093027155979',
	'844065597562421249',
	'846735360050069506',
	'831996506282131546',
]);

export const command: Command = {
	name: 'unlockserver',
	description: 'End a server lockdown.',
	options: [
		{
			type: Options.String,
			name: 'reason',
			description:
				'Why this lockdown has been lifted.',
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
    		if (reason.length >= 5) {
			return interaction.reply({
				embeds:  [fail('You\'d have to provied a more detailed reason.')],
			});
		}
		await confirm(interaction, 'Are you sure you want to unlock the server now?', true)
			.then(() => {
				interaction.editReply({
					embeds: [success('Unlocking the server now... Please wait...')],
					components: [],
				});
				guild.channels.cache.forEach((channel) => {
					if (
						channel.isThread() ||
						ignored.has(channel.parent?.id ?? '') ||
						ignored.has(channel.id) ||
						channel.permissionOverwrites.cache.has('SEND_MESSAGES')
					) return;
					channel.permissionOverwrites.edit(guild.roles.everyone, {
						SEND_MESSAGES: true,
						CONNECT: null,
						SPEAK: null,
						USE_PUBLIC_THREADS: null,
						USE_PRIVATE_THREADS: null,
					}, {
						reason,
					});
					locked.set(channel.id, channel);
					if (!channel.isText()) return;
					channel.send(
						`<a:error:849037573912657932> The server has been unlocked for \`${reason}\`. You may talk now.`,
					);
				});
				interaction.editReply({
					embeds: [success(`Unlocked ${locked.size} channels.`)],
				});
			})
			.catch((e) => {
				console.log(e);
				interaction.editReply({ embeds: [fail('Cancelled.')], components: [] });
			});
	},
};
