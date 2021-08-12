import { success, fail, confirm } from '../Modules/Embeds';
export const command = {
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
        await confirm(interaction, `Are you sure you want to unban ${user.tag}?`)
            .then(async () => {
            await interaction.guild?.members.unban(user, reason);
            const log = await client.modlogs.set({
                guildID: interaction.guild.id,
                userID: user.id,
                staffID: interaction.user.id,
                reason,
                caseType: 'Unban',
            });
            await interaction.editReply({
                embeds: [success(`${user.tag} has been **unbanned** | \`${log.punishID}\``)],
                components: [],
            });
        })
            .catch(() => {
            interaction.editReply({
                embeds: [fail('Cancelled.')],
                components: [],
            });
        });
    },
};
