"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'warn',
    description: 'Warns a user.',
    options: [
        {
            type: 6,
            name: 'user',
            description: 'The user to warn.',
            required: true,
        },
        {
            type: 3,
            name: 'reason',
            description: 'The reason for this warning.',
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
                embeds: [embeds_1.fail('I can\'t warn someone not in the server.')],
            });
        }
        if (member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                embeds: [embeds_1.fail('You can\'t warn a moderator/admin!')],
            });
        }
        await embeds_1.confirm(interaction, `Are you sure you want to warn ${member}?`)
            .then(async () => {
            const userEmbed = new discord_js_1.MessageEmbed()
                .setTitle(`You've been warned in **${interaction.guild?.name}**`)
                .addField('Reason', reason)
                .setColor('RED');
            await member.user.send({
                embeds: [userEmbed],
            }).catch(() => { });
            const log = await client.modlogs.set({
                guildID: interaction.guild.id,
                userID: member.id,
                staffID: interaction.user.id,
                reason,
                caseType: 'Warn',
                expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
                isActive: true,
            });
            await interaction.editReply({
                embeds: [embeds_1.success(`${member} has been **warned** | \`${log.punishID}\``)],
                components: [],
            });
        })
            .catch(() => {
            interaction.editReply({
                embeds: [embeds_1.fail('Cancelled.')],
                components: [],
            });
        });
    },
};
