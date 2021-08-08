"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../Modules/Embeds");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
    name: 'unmute',
    description: 'Unmutes a user.',
    options: [
        {
            type: 6 /* User */,
            name: 'user',
            description: 'The user to unmute.',
            required: true,
        },
        {
            type: 3 /* String */,
            name: 'reason',
            description: 'The reason for this unmute',
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_MESSAGES')) ?? false;
    },
    async run(interaction, options, client) {
        const member = options.getMember('user');
        const reason = options.getString('reason', true);
        if (typeof member === 'undefined') {
            return interaction.reply({
                embeds: [Embeds_1.fail('I can\'t unmute someone not in the server.')],
            });
        }
        const role = interaction.guild?.roles.cache.find((r) => r.name === 'Muted');
        if (typeof role === 'undefined') {
            return interaction.reply({
                embeds: [Embeds_1.fail('I was unable to find a "Muted" role.')],
            });
        }
        if (!member?.manageable) {
            return interaction.reply({
                embeds: [Embeds_1.fail('I can\'t manage this user!')],
            });
        }
        if (!member.roles.cache.has(role.id)) {
            return interaction.reply({
                embeds: [Embeds_1.fail(`${member} isn't muted!`)],
            });
        }
        await Embeds_1.confirm(interaction, `Are you sure you want to unmute ${member}?`)
            .then(async () => {
            const userEmbed = new discord_js_1.MessageEmbed()
                .setTitle(`You've been unmuted in **${interaction.guild?.name}**`)
                .addField('Reason', reason)
                .setColor('GREEN');
            await member.user.send({
                embeds: [userEmbed],
            }).catch(() => { });
            await member.roles.remove(role);
            const log = await client.modlogs.set({
                guildID: interaction.guild.id,
                userID: member.id,
                staffID: interaction.user.id,
                reason,
                caseType: 'Mute',
            });
            await interaction.editReply({
                embeds: [Embeds_1.success(`${member} has been **unmuted** | \`${log.punishID}\``)],
                components: [],
            });
            await client.modlogs.updateOne({ caseType: 'Mute', userID: member.id, isActive: true }, { isActive: false });
        })
            .catch(() => {
            interaction.editReply({
                embeds: [Embeds_1.fail('Cancelled.')],
                components: [],
            });
        });
    },
};
