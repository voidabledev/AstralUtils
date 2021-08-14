import { afkModel, AFK } from '../models/afkModel';
import { GuildMember, Collection } from 'discord.js';
export class AfkManager {
	private _cache = new Collection<string, AFK>();
	constructor() {
		this.cache();
	}
	async cache(): Promise<void> {
		const entries = await afkModel.find();
		entries.forEach((e) => this._cache.set(e.userId, e));
	}
	get(userId: string): AFK | undefined {
		return this._cache.get(userId) ?? undefined;
	}
	async set(member: GuildMember, message: string): Promise<AFK> {
		await member.setNickname('[AFK] ' + member.displayName).catch(() => null);
		const afk = await afkModel.create({ userId: member.id, message });
		this._cache.set(member.id, afk);
		return afk;
	}
	async unset(member: GuildMember): Promise<AFK | undefined> {
		await member
			.setNickname(member.displayName.replace('[AFK] ', ''))
			.catch(() => null);
		this._cache.delete(member.id);
		return (
			(await afkModel.findOneAndDelete({ userId: member.id })) ?? undefined
		);
	}
}
