import { economyModel } from '../Models/EconomyModel';
import { Collection } from 'discord.js';
export class EconomyManager {
    _cache = new Collection();
    _items = new Collection();
    constructor() {
        const items = [
            {
                name: 'Fishing Rod',
                id: 'fishrod',
                price: 10_000,
                sellable: true,
                abilities: ['fish'],
            },
        ];
        items.forEach(item => this._items.set(item.id, item));
    }
    async cache() {
        const profiles = await economyModel.find();
        profiles.forEach(profile => this._cache.set(profile.userId, profile));
    }
    getProfile(userId) {
        return {
            userId,
            coins: 0,
            itemIds: [],
            ...this._cache.get(userId),
        };
    }
    async addCoins(userId, coins) {
        await economyModel.updateOne({ userId }, { userId, $inc: { coins } }, { upsert: true });
        const profile = this.getProfile(userId);
        profile.coins += coins;
        this._cache.set(profile.userId, profile);
        return profile;
    }
    async removeCoins(userId, coins) {
        await economyModel.updateOne({ userId }, { userId, $inc: { coins } }, { upsert: true });
        const profile = this.getProfile(userId);
        profile.coins -= coins;
        this._cache.set(profile.userId, profile);
        return profile;
    }
    async addItem(userId, itemId) {
        await economyModel.updateOne({ userId }, { userId, $push: { itemIds: itemId } }, { upsert: true });
        const profile = this.getProfile(userId);
        profile.itemIds.push(itemId);
        this._cache.set(profile.userId, profile);
        return profile;
    }
    async removeItem(userId, itemId) {
        await economyModel.updateOne({ userId }, { userId, $pusll: { itemIds: itemId } }, { upsert: true });
        const profile = this.getProfile(userId);
        profile.itemIds.map(id => {
            if (id !== itemId)
                return id;
        });
        this._cache.set(profile.userId, profile);
        return profile;
    }
}
