import { MessageEmbed } from 'discord.js';
import { success, fail, confirm } from '../Modules/Embeds';
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const command = {
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
                embeds: [fail('I can\'t warn someone not in the server.')],
            });
        }
        if (member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                embeds: [fail('You can\'t warn a moderator/admin!')],
            });
        }
        await confirm(interaction, `Are you sure you want to warn ${member}?`)
            .then(async () => {
            const userEmbed = new MessageEmbed()
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
                embeds: [success(`${member} has been **warned** | \`${log.punishID}\``)],
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
