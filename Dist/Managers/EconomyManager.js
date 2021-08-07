"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyManager = void 0;
const discord_js_1 = require("discord.js");
class EconomyManager {
    _client;
    _cache = new discord_js_1.Collection();
    constructor(_client) {
        this._client = _client;
        // shut
    }
    async cache() {
        /* stfu */
    }
    getProfile(userId) {
        return this._cache.get(userId);
    }
    createProfile(userId) {
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
exports.EconomyManager = EconomyManager;
