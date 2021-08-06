"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyManager = void 0;
const discord_js_1 = require("discord.js");
class EconomyManager {
    constructor(_client) {
        this._client = _client;
        this._cache = new discord_js_1.Collection();
    }
    async cache() { }
    getProfile(userId) {
        return this._cache.get(userId);
    }
    createProfile(userId) {
        return {
            userId,
            coins: 0
        };
    }
    async addCoins() { }
    async removeCoins() { }
    async addItem() { }
    async removeItem() { }
}
exports.EconomyManager = EconomyManager;
