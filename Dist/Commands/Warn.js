"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../Modules/Embeds");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
    name: 'warn',
    description: 'Warns a user.',
    options: [
        {
            type: 6 /* User */,
            name: 'user',
            description: 'The user to warn.',
            required: true,
        },
        {
            type: 3 /* String */,
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
                embeds: [Embeds_1.fail('I can\'t warn someone not in the server.')],
            });
        }
        if (member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                embeds: [Embeds_1.fail('You can\'t warn a moderator/admin!')],
            });
        }
        await Embeds_1.confirm(interaction, `Are you sure you want to warn ${member}?`)
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
                embeds: [Embeds_1.success(`${member} has been **warned** | \`${log.punishID}\``)],
                components: [],
            });
        })
            .catch(() => {
            interaction.editReply({
                embeds: [Embeds_1.fail('Cancelled.')],
                components: [],
            });
        });
    },
};
