import { Client } from '../Modules/Client';
import { modlogModel, Pattern as Modlog, UpdateOptions } from '../Models/ModlogModel';
import { Snowflake, MessageEmbed, TextChannel } from 'discord.js';
import { id } from '../Modules/Utils';
export class ModlogManager {
	constructor(private _client: Client) {
		this._client = _client;
	}

	async getUser(userID: Snowflake): Promise<(Modlog | undefined)[]> {
		return await modlogModel.find({
			userID,
		}) ?? undefined;
	}

	async get(punishID: string): Promise<Modlog | undefined> {
		return await modlogModel.findOne({
			punishID,
		}) ?? undefined;
	}

	private async _set(data: Modlog): Promise<Modlog> {
		data.punishID = id(10, 10);
		while(await modlogModel.findOne({ punishID: data.punishID })) data.punishID = id(10, 10);
		return await modlogModel.create(data);
	}

	async delete(punishID: string): Promise<Modlog | undefined> {
		return await modlogModel.findOneAndDelete({ punishID }) ?? undefined;
	}

	async update(punishID: string, data: UpdateOptions): Promise<Modlog | undefined> {
		return await modlogModel.findOneAndUpdate({ punishID }, data) ?? undefined;
	}

	async create(data: Modlog): Promise<Modlog> {
		const log = await this._set(data);
		const automod = this._client.user?.id === log.staffID;
		const channel: TextChannel = (automod ?
			this._client.channels.cache.get('831996576778944612') :
			this._client.channels.cache.get('831996577690288188')) as TextChannel;

		const embed = new MessageEmbed()
			.setTitle(`Case ID #${data.punishID}`)
			.addField('Type', data.caseType)
			.addField('User', `<@${data.userID}> (${data.userID})`);
		automod ? null : embed.addField('Moderator', `<@${data.staffID}> (${data.staffID})`);
		embed
			.addField('Reason', data.reason)
			.setTimestamp(data.timestamp)
			.setColor('RANDOM');

		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.size ? webhooks.first() : await channel.createWebhook(this._client.user?.username ?? '', {
			avatar: this._client.user?.avatarURL() ?? undefined,
		});
		await webhook?.send({
			username: this._client.user?.username ?? undefined,
			avatarURL: this._client.user?.avatarURL() ?? undefined,
			embeds: [embed],
		});
		return log;
	}
}