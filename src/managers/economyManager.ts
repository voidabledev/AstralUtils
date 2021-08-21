/* eslint-disable @typescript-eslint/no-unused-vars */
import { economyModel, EconomyProfile } from '../models/economyModel';
import { Collection, Snowflake } from 'discord.js';
import { Client } from '../modules/client';
import { Item } from '../typings/item';

export class EconomyManager {
	private _cache = new Collection<Snowflake, EconomyProfile>();
	private _items = new Collection<string, Item>();
	constructor() {
		const items: Item[] = [
			{
				name: 'Fishing Rod',
				id: 'fishrod',
				price: 10_000,
				sellable: true,
				abilities: ['fish'],
			},
		];
		items.forEach((item) => this._items.set(item.id, item));
	}
	async cache(): Promise<void> {
		const profiles = await economyModel.find();
		profiles.forEach((profile) => this._cache.set(profile.userId, profile));
	}
	getProfile(userId: Snowflake): EconomyProfile {
		return {
			userId,
			coins: 0,
			itemIds: [],
			...this._cache.get(userId),
		};
	}
	async addCoins(userId: Snowflake, coins: number): Promise<EconomyProfile> {
		await economyModel.updateOne(
			{ userId },
			{ userId, $inc: { coins } },
			{ upsert: true },
		);
		const profile = this.getProfile(userId);
		profile.coins += coins;
		this._cache.set(profile.userId, profile);
		return profile;
	}
	async removeCoins(userId: Snowflake, coins: number): Promise<EconomyProfile> {
		await economyModel.updateOne(
			{ userId },
			{ userId, $inc: { coins } },
			{ upsert: true },
		);
		const profile = this.getProfile(userId);
		profile.coins -= coins;
		this._cache.set(profile.userId, profile);
		return profile;
	}
	async addItem(userId: Snowflake, itemId: string): Promise<EconomyProfile> {
		await economyModel.updateOne(
			{ userId },
			{ userId, $push: { itemIds: itemId } },
			{ upsert: true },
		);
		const profile = this.getProfile(userId);
		profile.itemIds.push(itemId);
		this._cache.set(profile.userId, profile);
		return profile;
	}
	async removeItem(userId: Snowflake, itemId: string): Promise<EconomyProfile> {
		await economyModel.updateOne(
			{ userId },
			{ userId, $pusll: { itemIds: itemId } },
			{ upsert: true },
		);

		const profile = this.getProfile(userId);
		profile.itemIds.map((id) => {
			if (id !== itemId) return id;
		});
		this._cache.set(profile.userId, profile);
		return profile;
	}
}
