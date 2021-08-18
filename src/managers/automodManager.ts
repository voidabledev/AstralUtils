import { Client } from '../modules/client';
import { Automod } from '../typings/automod';
import { Message, MessageEmbed } from 'discord.js';
import { wait } from '../modules/utils';

export class AutomodManager {
	constructor(private _client: Client) {
		this._client = _client;
	}
	/** This is called on every message to check if any automod action is taken. */
	async run(message: Message): Promise<void> {
		// dont run this in main server yet
		if (message.guild?.id !== '849344562891063356') return;
		this._data.forEach(async (data) => {
			if (
				data.triggers.some((t) => {
					switch (t.type) {
						case 'includes':
							return message.content.toLowerCase().trim().includes(t.name);
						case 'equals':
							return message.content.toLowerCase().trim() === t.name;
						default:
							return false;
					}
				}) &&
				(await data.allowed(message))
			) {
				data.execute(message);
			}
		});
	}
	/** All the things the automod responds to */
	private _data: Automod[] = [
		{
			triggers: [
				{
					name: 'discord.gg/',
					type: 'includes',
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
					].includes(message.channelId)
				);
			},
			execute: async (message) => {
				message.channel.send(
					`<a:animebonk:854351542252601404> ${message.author} you can't send invite links here!`,
				);
				this._warn(message, `Sending invite links in ${message.channel}`);
				message.delete();
			},
		},
	];
	/* Moderation methods */
	private async _warn(message: Message, reason: string): Promise<void> {
		if (!this._client.user) throw new Error('Client user not found.');
		if (!message.guild) throw new Error('Cannot use automod outside of guilds');
		reason = `[Automod] ${reason}`;
		const embed = new MessageEmbed()
			.setAuthor(
				message.author.displayAvatarURL({ dynamic: true, size: 512 }),
				`${message.author.tag} (${message.author.id})`,
			)
			.setTitle('User Warned')
			.addField('User', `${message.author} (${message.author.id})`, true)
			.addField('Staff', `${this._client.user} (${this._client.user.id})`, true)
			.addField('Reason', reason)
			.setColor('RED');
		await message.author
			.send({
				embeds: [embed],
			})
			.catch(() => null);
		await this._client.modlogs.set({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: this._client.user.id,
			reason,
			caseType: 'Warn',
			expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
			isActive: true,
		});
	}
	private async _mute(
		message: Message,
		reason: string,
		time: number,
	): Promise<void> {
		if (!this._client.user) throw new Error('Client user not found.');
		if (!message.guild || !message.member) {
			throw new Error('Cannot use automod outside of guilds');
		}
		const role = message.guild.roles.cache.find((r) => r.name === 'Muted');
		if (!role) throw new Error('No "Muted" role found.');
		reason = `[Automod] ${reason}`;
		const embed = new MessageEmbed()
			.setAuthor(
				message.author.displayAvatarURL({ dynamic: true, size: 512 }),
				`${message.author.tag} (${message.author.id})`,
			)
			.setTitle('User Muted')
			.addField('User', `${message.author} (${message.author.id})`, true)
			.addField('Staff', `${this._client.user} (${this._client.user.id})`, true)
			.addField(
				'Time',
				`<t:${Math.floor((new Date().getTime() + time) / 1000)}:R>`,
			)
			.addField('Reason', reason)
			.setColor('RED');
		await message.author
			.send({
				embeds: [embed],
			})
			.catch(() => null);
		await message.member.roles.add(role);
		await this._client.modlogs.set({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: this._client.user.id,
			reason,
			caseType: 'Mute',
			expires: new Date().getTime() + time,
			isActive: true,
		});
	}
	private async _ban(message: Message, reason: string) {
		if (!this._client.user) throw new Error('Client user not found.');
		if (!message.guild || !message.member) {
			throw new Error('Cannot use automod outside of guilds');
		}
		reason = `[Automod] ${reason}`;
		const embed = new MessageEmbed()
			.setAuthor(
				message.author.displayAvatarURL({ dynamic: true, size: 512 }),
				`${message.author.tag} (${message.author.id})`,
			)
			.setTitle('User Muted')
			.addField('User', `${message.author} (${message.author.id})`, true)
			.addField('Staff', `${this._client.user} (${this._client.user.id})`, true)
			.addField('Time', 'Permanent')
			.addField('Reason', reason)
			.setColor('RED');
		await message.author
			.send({
				embeds: [embed],
			})
			.catch(() => null);
		await message.guild?.members.ban(message.author, {
			reason,
		});
		await this._client.modlogs.set({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: this._client.user.id,
			reason,
			caseType: 'Ban',
			isActive: true,
		});
	}
}
