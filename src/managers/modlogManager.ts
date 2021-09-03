import { Client } from '../structures/client';
import {
	modlogModel,
	Pattern as Modlog,
	UpdateOptions,
	CreateOptions,
} from '../models/modlogModel';
import {
	Snowflake,
	MessageEmbed,
	TextChannel,
	Role,
	GuildMember,
} from 'discord.js';
import { id } from '../structures/utils';

export class ModlogManager {
	constructor(private _client: Client) {
		this._client = _client;
		this._interval(30000);
	}
	async getUser(userID: Snowflake): Promise<Modlog[]> {
		return await modlogModel.find({
			userID,
		});
	}
	async fetch(filter: UpdateOptions = {}): Promise<Modlog[]> {
		return await modlogModel.find(filter);
	}
	private async _interval(timeout: number): Promise<void> {
		setInterval(async () => {
			const logs = await this.fetch();
			logs
				.filter((l) => l.caseType === 'Mute' && l.isActive)
				.forEach(async (l) => {
					const guild = this._client.guilds.cache.get(l.guildID);
					const member = await guild?.members.fetch(l.userID).catch(() => {
						/* no member found */
					});
					const role = guild?.roles.cache.find((r) => r.name === 'Muted');
					if (
						member instanceof GuildMember &&
						typeof role !== 'undefined' &&
						!member.roles.cache.get(role.id)
					) {
						member.roles.add(role.id);
					}
				});
			logs
				.filter(
					(l) =>
						l.caseType === 'Mute' &&
						l.isActive &&
						l.expires !== undefined &&
						(l?.expires as number) < new Date().getTime(),
				)
				.forEach(async (l) => {
					const guild = this._client.guilds.cache.get(l.guildID);
					const mRole = guild?.roles.cache.find((r) => r.name === 'Muted');
					const quarantine = guild?.roles.cache.find(
						(r) => r.name === 'Quarantine',
					);
					const member = await guild?.members.fetch(l.userID).catch(() => {
						/* doesn't exist */
					});
					if (
						![guild, mRole, member].includes(undefined) &&
						!(member as GuildMember)?.roles.cache.has(quarantine?.id ?? '')
					) {
						(member as GuildMember)?.roles
							.remove(mRole as Role)
							.then(() => this.update(l.punishID, { isActive: false }))
							.catch(() => {
								/* ok then */
							});
					}
				});
			logs
				.filter(
					(l) =>
						l.caseType === 'Warn' &&
						l.isActive &&
						(l.expires as number) < new Date().getTime(),
				)
				.forEach(async (l) => {
					this.update(l.punishID, { isActive: false });
				});
			logs
				.filter(
					(l) =>
						l.caseType === 'Ban' &&
						l.isActive &&
						l.expires !== undefined &&
						(l?.expires as number) < new Date().getTime(),
				)
				.forEach(async (l) => {
					const guild = this._client.guilds.cache.get(l.guildID);
					if (await guild?.bans.fetch(l.userID)) {
						guild?.members.unban(l.userID);
						this.update(l.punishID, { isActive: false });
					}
				});
		}, timeout);
	}
	async get(punishID: string): Promise<Modlog | undefined> {
		return (
			(await modlogModel.findOne({
				punishID,
			})) ?? undefined
		);
	}
	async delete(punishID: string): Promise<Modlog | undefined> {
		return (await modlogModel.findOneAndDelete({ punishID })) ?? undefined;
	}
	async update(
		punishID: string,
		data: UpdateOptions,
	): Promise<Modlog | undefined> {
		return (
			(await modlogModel.findOneAndUpdate({ punishID }, data)) ?? undefined
		);
	}
	async updateOne(
		inputData: UpdateOptions,
		updateData: UpdateOptions,
	): Promise<Modlog | undefined> {
		return (
			(await modlogModel.findOneAndUpdate(inputData, updateData)) ?? undefined
		);
	}
	async set(data: CreateOptions): Promise<Modlog> {
		data.punishID = id(10, 10);
		data.timestamp = new Date().getTime();
		while (await modlogModel.findOne({ punishID: data.punishID })) {
			data.punishID = id(10, 10);
		}
		const log = await modlogModel.create(data);
		const automod = this._client.user?.id === log.staffID;
		const channel: TextChannel = (
			automod
				? this._client.channels.cache.get('831996576778944612')
				: this._client.channels.cache.get('831996577690288188')
		) as TextChannel;
		const embed = new MessageEmbed()
			.setTitle(`Case ID #${data.punishID}`)
			.addField('Type', data.caseType)
			.addField('User', `<@${data.userID}> (${data.userID})`);
		automod
			? null
			: embed.addField('Moderator', `<@${data.staffID}> (${data.staffID})`);
		embed
			.addField('Reason', data.reason)
			.setTimestamp(data.timestamp)
			.setColor('RANDOM');
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.size
			? webhooks.first()
			: await channel.createWebhook(this._client.user?.username ?? '', {
				avatar: this._client.user?.avatarURL() ?? undefined,
			});
		await webhook?.send({
			username: this._client.user?.username ?? undefined,
			avatarURL: this._client.user?.avatarURL() ?? undefined,
			embeds: [embed],
		});
		return log;
	}
	async deleteMany(punishIDs: string[]): Promise<void> {
		await modlogModel.deleteMany({ punishID: { $in: punishIDs } });
	}
}
