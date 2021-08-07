import { EconomyProfile } from '../Models/EconomyModel';
import { Collection, Snowflake } from 'discord.js';
import { Client } from '../Modules/Client';

export class EconomyManager {
	private _cache = new Collection<Snowflake, EconomyProfile>();
	constructor(private _client: Client) {
		// shut
	}

	async cache(): Promise<void> {
		/* stfu */
	}

	getProfile(userId: Snowflake): EconomyProfile | undefined {
		return this._cache.get(userId);
	}

	createProfile(userId: Snowflake): EconomyProfile {
		return {
			userId,
			coins: 0,
		};
	}

	async addCoins() {
		// shut
	}

	async removeCoins() {
		// shut
	}

	async addItem() {
		// shut
	}
	async removeItem() {
		// shut
	}
}
