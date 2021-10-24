import { croleModel, CustomRole } from '../models/croleModel';
import { Collection } from 'discord.js';
export class CustomRoleManager {
	private _cache: Collection<string, CustomRole>
	constructor() {
		this._cache = new Collection<string, CustomRole>();
		this.cache();
	}
	async cache(): Promise<void> {
		const customs = await croleModel.find({});
		customs.forEach((c) => this._cache.set(c.roleId, c));
	}
	getByRole(roleId: string): CustomRole | undefined {
		return this._cache.get(roleId);
	}
	getByUser(userId: string): typeof this._cache {
		return this._cache.filter((c) => c.userId === userId);
	}
	async set(roleId: string, userId: string): Promise<void> {
		await croleModel.create({ userId, roleId });
		this._cache.set(roleId, { userId, roleId });
	}
	async delete(roleId: string): Promise<void> {
		await croleModel.deleteOne({ roleId });
		this._cache.delete(roleId);
	}
	async transfer(roleId: string, userId: string): Promise<void> {
		await croleModel.updateOne({ roleId }, { userId }, { upsert: true });
		this._cache.set(roleId, { roleId, userId });
	}
}