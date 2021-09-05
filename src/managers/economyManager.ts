/* eslint-disable @typescript-eslint/no-unused-vars */
import { economyModel, EconomyProfile } from '../models/economyModel';
import { Collection, Snowflake } from 'discord.js';
import { Item } from '../typings/item';

export class EconomyManager {
	private _cache = new Collection<Snowflake, EconomyProfile>();
	private _items = new Collection<string, Item>();
	constructor() {
		const items: Item[] = [
			// !---------- ABILITIES -----------
			{
				name: 'Hunting Rifle',
				description: 'You can use this rifle to hunt animals in the forest.',
				id: 'rifle',
				price: 10_000,
				sellable: true,
				usable: false,
				buyable: true,
				abilities: ['hunt'],
			},
			{
				name: 'Fishing Rod',
				description: 'You can use this old fishing rod to go fishing.',
				id: 'fishrod',
				price: 15_000,
				sellable: true,
				usable: false,
				buyable: true,
				abilities: ['fish'],
			},
			{
				name: 'Shovel',
				description: 'You can use this shovel to dig for things in the ground.',
				id: 'shovel',
				price: 20_000,
				sellable: true,
				usable: false,
				buyable: true,
				abilities: ['dig'],
			},
			// !---------- FISHING ITEMS -----------
			{
				name: 'Garbage',
				description: 'A piece of trash you found somewhere.',
				id: 'garbage',
				price: 300 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Shoes',
				description: 'A pair of old, stinky shoes that nobody wants.',
				id: 'shoes',
				price: 500 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Common Fish',
				description: 'A fish found from fishing. Collect it, or sell it for some money.',
				id: 'commonfish',
				price: 1_500 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Jelly Fish',
				description: 'A jelly fish found from fishing. Collect it, or sell it for some money.',
				id: 'jellyfish',
				price: 3_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Rare Fish',
				description: 'A rare fish found from fishing. Collect it, or sell it for some money.',
				id: 'rarefish',
				price: 6_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Epic Fish',
				description: 'A very rare fish found from fishing. Collect it, or sell it for some money.',
				id: 'epicfish',
				price: 10_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Whale',
				description: 'A whale found from fishing. Collect it, or sell it for some money.',
				id: 'whale',
				price: 20_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Legendary Fish',
				description: 'The rarest of fishes. Collect it, or sell it for some money.',
				id: 'legendaryfish',
				price: 100_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			// !---------- HUNTING ITEMS -----------
			{
				name: 'Duck',
				description: 'A duck you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'duck',
				price: 500 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Squirrel',
				description: 'A squirrel you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'squirrel',
				price: 1_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Rabbit',
				description: 'A rabbit you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'rabbit',
				price: 3_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Deer',
				description: 'A deer you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'deer',
				price: 5_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Boar',
				description: 'A boar you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'boar',
				price: 10_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Monkey',
				description: 'A monkey you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'monkey',
				price: 15_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Lion',
				description: 'A lion you shot in the forest. Its only purpose is to be collected or sold.',
				id: 'lion',
				price: 20_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Dragon',
				description: 'A rare dragon. Its only purpose is to be collected or sold.',
				id: 'dragon',
				price: 100_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			// !---------- DIG ITEMS ------------
			{
				name: 'Worm',
				description: 'A worm you found while digging. Its only purpose is to be collected or sold.',
				id: 'worm',
				price: 1_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Spider',
				description: 'A spider you found while digging. Its only purpose is to be collected or sold.',
				id: 'spider',
				price: 3_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Junk',
				description: 'Some junk you dug up from the ground. Its only purpose is to be collected or sold.',
				id: 'junk',
				price: 5_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Dirt',
				description: 'Some dirt you found while digging. Its only purpose is to be collected or sold.',
				id: 'dirt',
				price: 10_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Seed',
				description: 'A seed you dug out of the dirt. Maybe you\'ll be able to plant it one day... For now, its only purpose is to be collected or sold.',
				id: 'seed',
				price: 15_000 / 0.75,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Stickbug',
				description: 'A stickbug you dug up from the ground. No, this one is dead. Its only purpose is to be collected or sold.',
				id: 'stickbug',
				price: 20_000,
				sellable: true,
				usable: false,
				buyable: false,
				abilities: [],
			},
			{
				name: 'Time Capsule',
				description: 'A time capsule you dug up from the ground. You can either open it, or sell it for a lot of money.',
				id: 'timecapsule',
				price: 100_000 / 0.75,
				sellable: true,
				usable: true,
				buyable: false,
				abilities: [],
				use: async (userId) => {
					return `You open the secret time capsule. Inside, you find a little paper with a handwritten note. It spells: ||${userId === '718813416407564340' ? 'You smell' : 'Inferium smells'}||`;
				},
			},
			// !---------- USABLE ITEMS -----------
			{
				name: 'Gift Box',
				description: 'A small gift box that contains a random amount of coins. Gift it to someone as a surprise.',
				id: 'giftbox',
				price: 2_500,
				sellable: false,
				usable: true,
				buyable: true,
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
		return this._items.get(itemId) ?? this._items.find((i) => i.id.includes(itemId));
	}
	allItems(): Collection<string, Item> {
		return this._items;
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
		if (profile.itemIds[itemId] === 0) delete profile.itemIds[itemId];
		await economyModel.updateOne(
			{ userId },
			profile.itemIds[itemId] > 0 ?
				{ userId, $inc: { [`itemIds.${itemId}`]: -amount } } :
				{ userId, $unset: { [`itemIds.${itemId}`]: 0 } },
			{ upsert: true },
		);
		this._cache.set(profile.userId, profile);
		return profile;
	}
	hasAbility(itemIds: string[], ability: string): boolean {
		return itemIds.map(itemId => this.getItem(itemId)).some(item => item && item.abilities.includes(ability));
	}
}
