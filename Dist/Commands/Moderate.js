import { success, fail } from '../Modules/Embeds';
import { id } from '../Modules/Utils';
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const command = {
    name: 'moderate',
    description: 'Moderates a user\'s nickname.',
    options: [
        {
            type: 6 /* User */,
            name: 'user',
            description: 'The user to moderate the nickname of.',
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_MESSAGES')) ?? false;
    },
    async run(interaction, options, client) {
        const member = options.getMember('user');
        const newNick = `Moderated Nickname ${id(36, 6)}`;
        if (typeof member === 'undefined') {
            return interaction.reply({
                embeds: [fail('The user you specified isn\'t in this server, I can\'t change their nickname.')],
            });
        }
        if (member.roles.highest.position >= interaction.member?.roles.highest.position) {
            return interaction.reply({
                embeds: [fail('You can\'t change the nickname of somebody above you!')],
            });
        }
        member.setNickname(newNick)
            .then(async () => {
            const log = await client.modlogs.set({
                userID: member.id,
                guildID: member.guild.id,
                staffID: interaction.user.id,
                reason: 'Rule 10',
                caseType: 'Moderated Nickname',
            });
            await interaction.reply({ embeds: [success(`Moderated ${member}'s nickname | \`${log.punishID}\``)] });
        })
            .catch((e) => interaction.reply({ embeds: [fail(`I was unable to change ${member}'s nickname: ${e.message}`)] }));
    },
};
