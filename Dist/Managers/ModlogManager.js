import { modlogModel } from '../Models/ModlogModel';
import { MessageEmbed, GuildMember } from 'discord.js';
import { id } from '../Modules/Utils';
export class ModlogManager {
    _client;
    constructor(_client) {
        this._client = _client;
        this._client = _client;
        this._interval(30000);
    }
    async getUser(userID) {
        return await modlogModel.find({
            userID,
        });
    }
    async fetch(filter = {}) {
        return await modlogModel.find(filter);
    }
    async _interval(timeout) {
        setInterval(async () => {
            const logs = await this.fetch();
            logs.filter((l) => l.caseType === 'Mute' && l.isActive).forEach(async (l) => {
                const guild = this._client.guilds.cache.get(l.guildID);
                const member = await guild?.members.fetch(l.userID).catch(() => { });
                const role = guild?.roles.cache.find((r) => r.name === 'Muted');
                if (member instanceof GuildMember && typeof role !== 'undefined' && !member.roles.cache.get(role.id)) {
                    member.roles.add(role.id);
                }
            });
            logs.filter((l) => l.caseType === 'Mute' && l.isActive && l.expires !== undefined && l?.expires < new Date().getTime()).forEach(async (l) => {
                const guild = this._client.guilds.cache.get(l.guildID);
                const mRole = guild?.roles.cache.find((r) => r.name === 'Muted');
                const quarantine = guild?.roles.cache.find((r) => r.name === 'Quarantine');
                const member = await guild?.members.fetch(l.userID).catch(() => { });
                if (!([guild, mRole, member].includes(undefined)) && !member?.roles.cache.has(quarantine?.id ?? '')) {
                    member?.roles.remove(mRole)
                        .then(() => this.update(l.punishID, { isActive: false }))
                        .catch(() => { });
                }
            });
            logs.filter((l) => l.caseType === 'Warn' && l.isActive && l.expires < new Date().getTime()).forEach(async (l) => {
                this.update(l.punishID, { isActive: false });
            });
            logs.filter((l) => l.caseType === 'Ban' && l.isActive && l.expires !== undefined && l?.expires < new Date().getTime()).forEach(async (l) => {
                const guild = this._client.guilds.cache.get(l.guildID);
                if (await guild?.bans.fetch(l.userID)) {
                    guild?.members.unban(l.userID);
                    this.update(l.punishID, { isActive: false });
                }
            });
        }, timeout);
    }
    async get(punishID) {
        return await modlogModel.findOne({
            punishID,
        }) ?? undefined;
    }
    async delete(punishID) {
        return await modlogModel.findOneAndDelete({ punishID }) ?? undefined;
    }
    async update(punishID, data) {
        return await modlogModel.findOneAndUpdate({ punishID }, data) ?? undefined;
    }
    async updateOne(inputData, updateData) {
        return await modlogModel.findOneAndUpdate(inputData, updateData) ?? undefined;
    }
    async set(data) {
        data.punishID = id(10, 10);
        data.timestamp = new Date().getTime();
        while (await modlogModel.findOne({ punishID: data.punishID }))
            data.punishID = id(10, 10);
        const log = await modlogModel.create(data);
        const automod = this._client.user?.id === log.staffID;
        const channel = (automod ?
            this._client.channels.cache.get('831996576778944612') :
            this._client.channels.cache.get('831996577690288188'));
        const embed = new MessageEmbed()
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
    async deleteMany(punishIDs) {
        await modlogModel.deleteMany({ punishID: { $in: punishIDs } });
    }
}
