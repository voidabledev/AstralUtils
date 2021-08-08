"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Embeds_1 = require("../Modules/Embeds");
const discord_js_1 = require("discord.js");
exports.command = {
    name: 'case',
    description: 'View information on a moderation case.',
    options: [
        {
            name: 'punish-id',
            description: 'The 10-digit punishment ID.',
            type: 4 /* Integer */,
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_MESSAGES')) ?? false;
    },
    async run(interaction, options, client) {
        const punishID = options.getInteger('punish-id', true).toString();
        const log = await client.modlogs.get(punishID);
        if (!log) {
            return interaction.reply({
                embeds: [Embeds_1.fail('I couldn\'t find a punishment with this ID!')],
            });
        }
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.avatarURL({ dynamic: true }) ?? undefined)
            .setTitle('Case Information')
            .addField('Type', log.caseType)
            .addField('Moderator', `<@${log.staffID}> (${log.staffID})`)
            .addField('User', `<@${log.userID}> (${log.userID})`)
            .addField('Reason', log.reason)
            .addField('Time', `<t:${Math.floor(log.timestamp / 1000)}:R> (<t:${Math.floor(log.timestamp / 1000)}:f>)`)
            .addField(log.isActive !== false ? 'Expires' : 'Expired', log.expires ? `<t:${Math.floor(log.expires / 1000)}:R> (<t:${Math.floor(log.expires / 1000)}:f>)` : 'Not Applicable')
            .setFooter(`Punishment ID: ${punishID}`)
            .setColor('RANDOM');
        interaction.reply({
            embeds: [embed],
        });
    },
};
