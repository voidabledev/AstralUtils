"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: 'unban',
    description: 'Unans a user.',
    options: [
        {
            type: 6 /* User */,
            name: 'user',
            description: 'The user to ban.',
            required: true,
        },
        {
            type: 3 /* String */,
            name: 'reason',
            description: 'The reason for this unban',
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('BAN_MEMBERS')) ?? false;
    },
    async run(interaction, options, client) {
        const user = options.getUser('user', true);
        const reason = options.getString('reason', true);
        if (!(await interaction.guild?.bans.fetch())?.find((b) => b.user.id === user.id)) {
            return interaction.reply({
                content: 'That user isn\'t banned!',
                ephemeral: true,
            });
        }
        const row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton().setLabel('Confirm').setStyle('SUCCESS').setCustomId('confirm-unban'), new discord_js_1.MessageButton().setLabel('Cancel').setStyle('DANGER').setCustomId('cancel-unban'));
        await interaction.reply({
            content: `Do you want to unban ${user.tag} for \`${reason}\`?`,
            components: [row],
            ephemeral: true,
        });
        const confirmFilter = (i) => i.customId === 'confirm-unban' && i.user.id === interaction.user.id;
        const cancelFilter = (i) => i.customId === 'cancel-unban' && i.user.id === interaction.user.id;
        const confirmCollector = interaction.channel?.createMessageComponentCollector({ filter: confirmFilter, time: 15000 });
        const cancelCollector = interaction.channel?.createMessageComponentCollector({ filter: cancelFilter, time: 15000 });
        cancelCollector?.on('collect', async (i) => {
            confirmCollector?.dispose(i);
            cancelCollector?.stop();
        });
        cancelCollector?.on('end', async () => {
            interaction.editReply({
                content: 'Cancelled.',
                components: [],
            });
        });
        confirmCollector?.on('collect', async (i) => {
            cancelCollector?.dispose(i);
            confirmCollector?.dispose(i);
            await interaction.guild?.members.unban(user, reason);
            const log = await client.modlogs.set({
                guildID: interaction.guild.id,
                userID: user.id,
                staffID: interaction.user.id,
                reason,
                caseType: 'Unban',
            });
            await interaction.editReply({
                content: `${user.tag} has been **unbanned** | \`${log.punishID}\``,
                components: [],
            });
        });
    },
};
