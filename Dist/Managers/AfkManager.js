"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfkManager = void 0;
const AfkModel_1 = require("../Models/AfkModel");
const discord_js_1 = require("discord.js");
class AfkManager {
    _cache = new discord_js_1.Collection();
    constructor() {
        this.cache();
    }
    async cache() {
        const entries = await AfkModel_1.afkModel.find();
        entries.forEach((e) => this._cache.set(e.userId, e));
    }
    get(userId) {
        return this._cache.get(userId) ?? undefined;
    }
    async set(member, message) {
        await member.setNickname('[AFK] ' + member.displayName).catch(() => null);
        const afk = await AfkModel_1.afkModel.create({ userId: member.id, message });
        this._cache.set(member.id, afk);
        return afk;
    }
    async unset(member) {
        await member.setNickname(member.displayName.replace('[AFK] ', '')).catch(() => null);
        this._cache.delete(member.id);
        return await AfkModel_1.afkModel.findOneAndDelete({ userId: member.id }) ?? undefined;
    }
}
exports.AfkManager = AfkManager;
