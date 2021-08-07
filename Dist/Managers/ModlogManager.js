"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModlogManager = void 0;
const ModlogModel_1 = require("../Models/ModlogModel");
const discord_js_1 = require("discord.js");
const Utils_1 = require("../Modules/Utils");
class ModlogManager {
    constructor(_client) {
        this._client = _client;
        this._client = _client;
    }
    async getUser(userID) {
        return await ModlogModel_1.modlogModel.find({
            userID,
        }) ?? undefined;
    }
    async get(punishID) {
        return await ModlogModel_1.modlogModel.findOne({
            punishID,
        }) ?? undefined;
    }
    async delete(punishID) {
        return await ModlogModel_1.modlogModel.findOneAndDelete({ punishID }) ?? undefined;
    }
    async update(punishID, data) {
        return await ModlogModel_1.modlogModel.findOneAndUpdate({ punishID }, data) ?? undefined;
    }
    async set(data) {
        data.punishID = Utils_1.id(10, 10);
        data.timestamp = new Date().getTime();
        while (await ModlogModel_1.modlogModel.findOne({ punishID: data.punishID }))
            data.punishID = Utils_1.id(10, 10);
        const log = await ModlogModel_1.modlogModel.create(data);
        const automod = this._client.user?.id === log.staffID;
        const channel = (automod ?
            this._client.channels.cache.get('831996576778944612') :
            this._client.channels.cache.get('831996577690288188'));
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`Case ID #${data.punishID}`)
            .addField('Type', data.caseType)
            .addField('User', `<@${data.userID}> (${data.userID})`);
        automod ? null : embed.addField('Moderator', `<@${data.staffID}> (${data.staffID})`);
        embed
            .addField('Reason', data.reason)
            .setTimestamp(data.timestamp)
            .setColor('RANDOM');
        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.size ? webhooks.first() : await channel.createWebhook(this._client.user?.username ?? '', {
            avatar: this._client.user?.avatarURL() ?? undefined,
        });
        await webhook?.send({
            username: this._client.user?.username ?? undefined,
            avatarURL: this._client.user?.avatarURL() ?? undefined,
            embeds: [embed],
        });
        return log;
    }
}
exports.ModlogManager = ModlogManager;
