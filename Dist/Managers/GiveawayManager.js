"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayManager = void 0;
const GiveawayModel_1 = require("../Models/GiveawayModel");
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../Modules/Embeds");
class GiveawayManager {
    _client;
    constructor(_client, interval) {
        this._client = _client;
        this._client = _client;
        this._check(interval);
    }
    async _check(interval) {
        setInterval(async () => {
            const giveaways = await GiveawayModel_1.giveawayModel.find();
            giveaways.filter((g) => !g.ended && g.end < Date.now()).forEach((g) => this.end(g.messageId));
        }, interval);
    }
    async create(data, text, interaction) {
        await interaction.reply({
            content: text,
        });
        const message = await interaction.fetchReply();
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`<:bluedot:842408037502550106> **${data.prize}** <:bluedot:842408037502550106>`)
            .setDescription(`**Hosted by:** <@${data.host}>\n${data.sponsor ? `**Sponsored by:** <@${data.sponsor}\n` : ''}**Ends:** <t:${Math.floor(data.end / 1000)}:R>\n${data.requirement ? `**Requirement:** ${data.requirement}\n` : ''}`)
            .setFooter(`Message ID: ${message.id} | Winners: ${data.winnerCount}`)
            .setColor('ORANGE');
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setStyle('SUCCESS').setLabel('Enter').setCustomId(`enter-giveaway-${message.id}`), new discord_js_1.MessageButton().setStyle('DANGER').setLabel('Control').setCustomId(`control-giveaway-${message.id}`));
        await interaction.editReply({
            content: text,
            embeds: [embed],
            components: [row],
        });
        data.ended = false;
        data.messageId = message.id;
        data.entries = [];
        const giveaway = await GiveawayModel_1.giveawayModel.create(data);
        return giveaway;
    }
    async update(messageId, data, text) {
        await GiveawayModel_1.giveawayModel.updateOne({ messageId }, data);
        const giveaway = await GiveawayModel_1.giveawayModel.findOne({ messageId });
        if (!giveaway)
            throw new Error('GiveawayError: Giveaway not found');
        const message = await this._client.guilds.cache.get(giveaway.guildId)?.channels.cache.get(giveaway.channelId)?.messages.fetch(messageId);
        if (!message)
            throw new Error('GiveawayError: Unknown message');
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`<:bluedot:842408037502550106> **${data.prize}** <:bluedot:842408037502550106>`)
            .setDescription(`**Hosted by:** <@${data.host}>\n${data.sponsor ? `**Sponsored by:** <@${data.sponsor}\n` : ''}**Ends:** <t:${Math.floor(data.end / 1000)}:R>\n${data.requirement ? `**Requirement:** ${data.requirement}\n` : ''}`)
            .setFooter(`Message ID: ${message.id} | Winners: ${data.winnerCount}`)
            .setColor('ORANGE');
        await message.edit({
            content: text ?? message.content,
            embeds: [embed],
        });
        return giveaway;
    }
    async enter(messageId, userId) {
        const giveaway = await GiveawayModel_1.giveawayModel.findOneAndUpdate({
            messageId,
        });
        if (!giveaway)
            throw new Error('GiveawayError: Unknown giveaway');
        if (giveaway.entries.includes(userId))
            return 'You have already entered this giveaway!';
        await GiveawayModel_1.giveawayModel.updateOne({
            messageId,
        }, {
            $push: {
                entries: userId,
            },
        });
        giveaway.entries.push(userId);
        return 'Entered!';
    }
    async end(messageId) {
        const giveaway = await GiveawayModel_1.giveawayModel.findOneAndUpdate({ messageId }, { ended: true, end: Date.now() });
        if (!giveaway)
            throw new Error('GiveawayError: Unknown giveaway');
        const guild = this._client.guilds.cache.get(giveaway.guildId);
        if (!guild)
            throw new Error('GiveawayError: Unknown guild');
        const channel = guild.channels.cache.get(giveaway.channelId);
        if (!channel || !channel.isText())
            throw new Error('GiveawayError: Unknown channel');
        const message = await channel.messages.fetch(giveaway.messageId);
        if (!message)
            throw new Error('GiveawayError: Unknown message');
        const winners = [];
        for (let i = 0; i < Math.min(giveaway.winnerCount, giveaway.entries.length); i++) {
            winners.push(giveaway.entries.splice(Math.random() * giveaway.entries.length, 1)[0]);
        }
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`<:bluedot:842408037502550106> **${giveaway.prize}** <:bluedot:842408037502550106>`)
            .setDescription(`**Hosted by:** <@${giveaway.host}>\n${giveaway.sponsor ? `**Sponsored by:** <@${giveaway.sponsor}>\n` : ''}**Ended:** <t:${Math.floor(giveaway.end / 1000)}:R>\n${giveaway.requirement ? `**Requirement:** ${giveaway.requirement}\n` : ''}\n **Winners:** ${winners.map((w) => `<@${w}>`).join(', ')}`)
            .setFooter(`Message ID: ${message.id} | Winners: ${giveaway.winnerCount}`)
            .setColor('RED');
        const initialRow = message.components[0];
        initialRow?.components[0].setDisabled(true);
        await message.edit({
            content: ':tada: **This giveaway has ended** :tada:',
            embeds: [embed],
            components: [initialRow],
        });
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setStyle('DANGER').setLabel('Control').setCustomId(`control-giveaway-${giveaway.messageId}`), new discord_js_1.MessageButton().setStyle('LINK').setURL(message.url).setLabel(`${giveaway.entries.length + winners.length} entries`));
        await channel.send({
            content: `Congratulations ${winners.map((w) => `<@${w}>`).join(', ')}, you have won **${giveaway.prize}**!`,
            components: [row],
        });
        giveaway.ended = true;
        return giveaway;
    }
    async delete(messageId) {
        const giveaway = await GiveawayModel_1.giveawayModel.findOneAndDelete({ messageId });
        if (!giveaway)
            return undefined;
        const message = await this._client.guilds.cache.get(giveaway.guildId)?.channels.cache.get(giveaway.channelId)?.messages.fetch(messageId);
        if (message)
            message.delete();
        return giveaway;
    }
    async displayControl(interaction) {
        if (!interaction.customId.startsWith('control-giveaway-'))
            throw new Error('GiveawayError: couldn\'t find a giveaway associated to this interaction.');
        if (!interaction.member?.roles.cache.find((r) => r.name.endsWith('Giveaways')) && !(interaction.member?.permissions.has('MANAGE_MESSAGES'))) {
            return interaction.reply({
                embeds: [Embeds_1.fail('You don\'t have permission to view the control panel for this giveaway!')],
                ephemeral: true,
            });
        }
        const messageId = interaction.customId.replace('control-giveaway-', '');
        const message = await interaction.channel?.messages.fetch(messageId);
        const giveaway = await GiveawayModel_1.giveawayModel.findOne({ messageId });
        if (!giveaway)
            throw new Error('GiveawayError: Unknown giveaway.');
        if (!message)
            throw new Error('GiveawayError: Unknown message.');
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Giveaway control panel')
            .setDescription('Use the buttons below to the giveaway.');
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setStyle('PRIMARY').setLabel('End').setCustomId(`end-giveaway-${messageId}`).setDisabled(giveaway.ended), new discord_js_1.MessageButton().setStyle('PRIMARY').setLabel('Reroll').setCustomId(`reroll-giveaway-${messageId}`).setDisabled(!giveaway.ended), new discord_js_1.MessageButton().setStyle('PRIMARY').setLabel('Delete').setCustomId(`delete-giveaway-${messageId}`), new discord_js_1.MessageButton().setStyle('LINK').setLabel(`${giveaway.entries.length} entries`).setURL(message.url));
        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });
    }
}
exports.GiveawayManager = GiveawayManager;
