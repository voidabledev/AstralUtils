/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '../structures/client';
import { Automod } from '../typings/automod';
import { Message, MessageEmbed, Collection } from 'discord.js';
import { wait } from '../structures/utils';

export class AutomodManager {
	private _spam = new Collection<string, Message[]>();

	constructor(private _client: Client) {
		this._client = _client;
	}
	/** This is called on every message to check if any automod action is taken. */
	async run(message: Message): Promise<void> {
		const spam = this._spam.get(message.author.id) ?? [];
		spam.push(message);
		this._spam.set(message.author.id, spam.filter((m) => m.createdTimestamp + 4000 > Date.now()));
		for (const data of this._data) {
			try {
				if (
					data.triggers.some((t) => {
						switch (t.type) {
						case 'includes':
							return message.content.toLowerCase().replaceAll(/\s/g, '').includes(t.name);
						case 'except includes':
							if (message.content.toLowerCase().replaceAll(/\s/g, '').includes(t.name)) {
								throw null;
							}
							return false;
						case 'equals':
							return message.content.toLowerCase().trim() === t.name;
						case 'except equals':
							if (message.content.toLowerCase().trim() === t.name) throw null;
							return false;
						case 'attachment':
							return !message.attachments.every(
								(a) => data.triggers.some((t2) => a.name?.toLowerCase()?.endsWith(t2.name) ?? false),
							);
						case 'except attachment':
							if (
								!message.attachments.every(
									(a) => data.triggers.some((t2) => a.name?.toLowerCase()?.endsWith(t2.name) ?? false),
								)
							) {
								throw null;
							}
							return false;
						case 'spam':
							return (this._spam.get(message.author.id)?.length ?? 0) >= (+t.name || -1);
						default:
							return false;
						}
					}) &&
					(await data.allowed(message))
				) {
					data.execute(message).catch((e) =>
						console.warn(`An error was encountered during execution of automod: ${e.message}`),
					);
				}
			}
			catch {
				continue;
			}
		}
	}
	/** All the things the automod responds to */
	private _data: Automod[] = [
		{
			triggers: [
				{
					name: '5',
					type: 'spam',
				},
			],
			allowed: async (message) => {
				return true;
			},
			execute: async (message) => {
				if (message.channel.type === 'DM') return;
				message.channel.bulkDelete(this._spam.get(message.author.id) ?? []);
				this._spam.delete(message.author.id);

				const m = await message.channel.send(
					`<a:animebonk:854351542252601404> ${message.author} don't send messages so quickly!`,
				);
				await this._mute(
					message,
					`Spamming in ${message.channel}`,
					60_000 * 2,
				);
				await wait(5000);
				m.delete();
			},
		},
		{
			triggers: [
				{
					name: 'discord.gg/',
					type: 'includes',
				},
				{
					name: 'discord.gg/belugang',
					type: 'except includes',
				},
			],
			allowed: async (message) => {
				return (
					!!message.member &&
					!message.member.permissions.has('MANAGE_MESSAGES') &&
					![
						'831996540436086884',
						'831996541501308939',
						'837431285051031572',
						'831996545569652766',
					].includes(message.channelId)
				);
			},
			execute: async (message) => {
				const m = await message.channel.send(
					`<a:animebonk:854351542252601404> ${message.author} you can't send invite links here!`,
				);
				this._mute(
					message,
					`Sending invite links in ${message.channel}`,
					60_000 * 15,
				);
				if (!message.deleted) message.delete();
				await wait(5000);
				m.delete();
			},
		},
		{
			triggers: [
				'https://grabify.link',
				'https://bmwforum.co',
				'https://leancoding.co',
				'https://spottyfly.com',
				'https://stopify.co',
				'https://yoütu.be',
				'https://discörd.com',
				'https://minecräft.com',
				'https://freegiftcards.co',
				'https://disçordapp.com',
				'https://särahah.eu',
				'https://särahah.pl',
				'https://xda-developers.us',
				'https://quickmessage.us',
				'https://särahah.pl',
				'https://fortnight.space',
				'https://särahah.pl',
				'https://fortnitechat.site',
				'https://youshouldclick.us',
				'https://joinmy.site',
				'https://crabrave.pw',
				'https://lovebird.guru',
				'https://trulove.guru',
				'https://dateing.club',
				'https://otherhalf.life',
				'https://shrekis.life',
				'https://datasig.io',
				'https://datauth.io',
				'https://headshot.monster',
				'https://gaming-at-my.best',
				'https://progaming.monster',
				'https://yourmy.monster',
				'https://screenshare.host',
				'https://imageshare.best',
				'https://screenshot.best',
				'https://gamingfun.me',
				'https://mypic.icu',
				'https://catsnthings.fun',
				'https://curiouscat.club',
			].map((str) => {
				return {
					name: str,
					type: 'includes',
				};
			}),
			allowed: async (message) => {
				return true;
			},
			execute: async (message) => {
				const m = await message.channel.send(
					`<a:error:849037573912657932> ${message.author} you can't send malicious links here!`,
				);
				if (!message.deleted) message.delete();
				await this._ban(
					message,
					`Sending prohibited links in ${message.channel}`,
				);
				await wait(5000);
				m.delete();
			},
		},
		{
			triggers: ['nigg', 'n1gg', 'n!gg', 'nigeria', 'niger'].map((str) => {
				return {
					name: str,
					type: 'includes',
				};
			}),
			allowed: async (message) => {
				return true;
			},
			execute: async (message) => {
				const m = await message.channel.send(
					`<a:error:849037573912657932> ${message.author} racist language is not allowed here!`,
				);
				if (!message.deleted) message.delete();
				await this._ban(message, `Racist language in ${message.channel}`);
				await wait(5000);
				m.delete();
			},
		},
		{
			triggers: [
				'dick',
				'd1ck',
				'd!ck',
				'penis',
				'p3nis',
				'pen1s',
				'p3n1s',
			].map((str) => {
				return {
					name: str,
					type: 'includes',
				};
			}),
			allowed: async (message) => {
				return (
					!!message.member && !message.member.permissions.has('MANAGE_MESSAGES')
				);
			},
			execute: async (message) => {
				const m = await message.channel.send(
					`<a:animebonk:854351542252601404> ${message.author} we are a friendly server. Please watch your language!`,
				);
				if (!message.deleted) message.delete();
				await this._warn(message, `Explicit language in ${message.channel}`);
				await wait(5000);
				m.delete();
			},
		},
		{
			triggers: [
				'.png',
				'.jpg',
				'.jpeg',
				'.webm',
				'.mp4',
				'.m4v',
				'.mov',
				'.gif',
				'.bmp',
				'.pdf',
				'.txt',
				'.tif',
				'.svg',
				'.webp',
				'.mp3',
				'.flac',
				'.wav',
			].map((str) => {
				return {
					name: str,
					type: 'attachment',
				};
			}),
			allowed: async (message) => {
				return (
					!!message.member && !message.member.permissions.has('ADMINISTRATOR')
				);
			},
			execute: async (message) => {
				const m = await message.channel.send(
					`<a:animebonk:854351542252601404> ${message.author} you are not permitted to send this attachment!`,
				);
				await this._mute(
					message,
					`Potentially malicious attachment in ${message.channel}`,
					60_000 * 15,
				);
				if (!message.deleted) message.delete();
				await wait(5000);
				m.delete();
			},
		},
	];
	/* Moderation methods */
	private async _warn(message: Message, reason: string): Promise<void> {
		if (message.member?.permissions.has('MANAGE_MESSAGES')) {
			return; // Do not punish staff members
		}
		if (!this._client.user) throw new Error('Client user not found.');
		if (!message.guild) throw new Error('Cannot use automod outside of guilds');
		reason = `[Automod] ${reason}`;
		const log = await this._client.modlogs.set({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: this._client.user.id,
			reason,
			caseType: 'Warn',
			expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
			isActive: true,
		});
		const embed = new MessageEmbed()
			.setAuthor(
				'Astral Automod',
				this._client.user.displayAvatarURL({ dynamic: true, size: 512 }),
			)
			.setTitle(`You were warned in ${message.guild?.name}!`)
			.addField('Reason', reason)
			.addField('Duration', '30 days', true)
			.setFooter(`Punishment ID: ${log.punishID}`)
			.setColor('YELLOW');
		await message.author
			.send({
				embeds: [embed],
			})
			.catch(() => null);
	}
	private async _mute(
		message: Message,
		reason: string,
		time: number,
	): Promise<void> {
		if (message.member?.permissions.has('MANAGE_MESSAGES')) return; // Do not punish staff members
		if (!this._client.user) throw new Error('Client user not found.');
		if (!message.guild || !message.member) {
			throw new Error('Cannot use automod outside of guilds');
		}
		const role = message.guild.roles.cache.find((r) => r.name === 'Muted');
		if (!role) throw new Error('No "Muted" role found.');
		reason = `[Automod] ${reason}`;
		const log = await this._client.modlogs.set({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: this._client.user.id,
			reason,
			caseType: 'Mute',
			expires: new Date().getTime() + time,
			isActive: true,
		});
		const embed = new MessageEmbed()
			.setAuthor(
				'Astral Automod',
				this._client.user.displayAvatarURL({ dynamic: true, size: 512 }),
			)
			.setTitle(`You were muted in ${message.guild?.name}!`)
			.addField('Reason', reason)
			.addField('Duration', time ? `<t:${Math.floor(
				(new Date().getTime() + time) / 1000,
			)}:f> (<t:${Math.floor(
				(new Date().getTime() + time) / 1000,
			)}:R>)` : 'Permanent', true)
			.setFooter(`Punishment ID: ${log.punishID}`)
			.setColor('ORANGE');
		await message.author
			.send({
				embeds: [embed],
			})
			.catch(() => null);
		await message.member.roles.add(role);
	}
	private async _ban(message: Message, reason: string) {
		if (message.member?.permissions.has('MANAGE_MESSAGES')) return; // Do not punish staff members
		if (!this._client.user) throw new Error('Client user not found.');
		if (!message.guild || !message.member) {
			throw new Error('Cannot use automod outside of guilds');
		}
		reason = `[Automod] ${reason}`;
		const log = await this._client.modlogs.set({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: this._client.user.id,
			reason,
			caseType: 'Ban',
			isActive: true,
		});
		const embed = new MessageEmbed()
			.setAuthor(
				message.author.tag,
				message.author.displayAvatarURL({ dynamic: true, size: 512 }),
			)
			.setAuthor(
				'Astral Moderation',
				this._client.user.displayAvatarURL({ dynamic: true, size: 512 }),
			)
			.setTitle(`You were banned in ${message.guild?.name}!`)
			.addField('Reason', reason)
			.addField('Duration', 'Permanent')
			.setFooter(`Punishment ID: ${log.punishID}`)
			.setColor('RED');
		await message.author
			.send({
				embeds: [embed],
			})
			.catch(() => null);
		await message.guild?.members.ban(message.author, {
			reason,
		});
	}
}
