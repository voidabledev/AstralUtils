/* eslint-disable @typescript-eslint/no-unused-vars */
import { economyModel, EconomyProfile } from '../models/economyModel';
import { Collection, Snowflake } from 'discord.js';
import { Item } from '../typings/item';

export class EconomyManager {
	private _cache = new Collection<Snowflake, EconomyProfile>();
	private _items = new Collection<string, Item>();
	constructor() {
		const items: Item[] = [
			{
				name: 'Fishing Rod',
				description: 'You can use this old fishing rod to go fishing.',
				id: 'fishrod',
				price: 10_000,
				sellable: true,
				usable: false,
				abilities: ['fish'],
			},
			{
				name: 'Hunting Rifle',
				description: 'You can use this rifle to hunt animals in the forest.',
				id: 'rifle',
				price: 15_000,
				sellable: true,
				usable: false,
				abilities: ['hunt'],
			},
			{
				name: 'Shovel',
				description: 'You can use this shovel to dig for things in the ground.',
				id: 'shovel',
				price: 20_000,
				sellable: true,
				usable: false,
				abilities: ['dig'],
			},
			{
				name: 'Common Fish',
				description: 'A fish found from fishing. Collect it, or sell it for some money.',
				id: 'commonfish',
				price: 2_000, // sells for 1.5k
				sellable: true,
				usable: false,
				abilities: [],
			},
			{
				name: 'Rare Fish',
				description: 'A rare fish found from fishing. Collect it, or sell it for some money.',
				id: 'rarefish',
				price: 8_000, // sells for 6k
				sellable: true,
				usable: false,
				abilities: [],
			},
			{
				name: 'Garbage',
				description: 'A piece of trash you found somewhere.',
				id: 'garbage',
				price: 400, // sells for 300
				sellable: true,
				usable: false,
				abilities: [],
			},
			{
				name: 'Gift Box',
				description: 'A small gift box that contains a random amount of coins. Gift it to someone as a surprise.',
				id: 'giftbox',
				price: 2_500,
				sellable: false,
				usable: true,
				abilities: [],
				use: async (userId, amount) => {
					const coins = amount * (1_000 + Math.floor(Math.random() * 3000));
					await this.addCoins(userId, coins);
					return `You opened ${amount} Gift Box${amount > 1 ? 'es' : ''} and got <:AstralCoin:877583618770370582>${coins}.`;
				},
			},
		];
		items.forEach((item) => this._items.set(item.id, item));
	}
	async cache(): Promise<void> {
		const profiles = await economyModel.find();
		profiles.forEach((profile) => this._cache.set(profile.userId, profile));
	}
	getProfile(userId: Snowflake): EconomyProfile {
		return this._cache.get(userId) ?? {
			userId,
			coins: 0,
			itemIds: {},
		};
	}
	getItem(itemId: string): Item | undefined {
		return this._items.get(itemId);
	}
	allItems(): Item[] {
		return this._items.map((i) => i);
		// ! It isn't needed to use .map if it doesn't map to anything.
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
		coins *= -1;
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
	async addItem(userId: Snowflake, itemId: string, amount = 1): Promise<EconomyProfile> {
		if (!this._items.get(itemId)) throw new Error('Unknown item');
		await economyModel.updateOne(
			{ userId },
			{ userId, $inc: { [`itemIds.${itemId}`]: amount } },
			{ upsert: true },
		);
		const profile = this.getProfile(userId);
		profile.itemIds[itemId] ??= 0;
		profile.itemIds[itemId] += amount;
		this._cache.set(profile.userId, profile);
		return profile;
	}
	async removeItem(userId: Snowflake, itemId: string, amount = 1): Promise<EconomyProfile> {
		if (!this._items.get(itemId)) throw new Error('Unknown item');

		const profile = this.getProfile(userId);
		profile.itemIds[itemId] ??= 0;
		if (amount > profile.itemIds[itemId]) amount = profile.itemIds[itemId];
		profile.itemIds[itemId] -= amount;
		await economyModel.updateOne(
			{ userId },
			{ userId, $inc: { [`itemIds.${itemId}`]: -amount } },
			{ upsert: true },
		);
		this._cache.set(profile.userId, profile);
		return profile;
	}
	hasAbility(itemIds: string[], ability: string): boolean {
		return itemIds.map(itemId => this.getItem(itemId)).some(item => item && item.abilities.includes(ability));
	}
}
