"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Embeds_1 = require("../Modules/Embeds");
const Utils_1 = require("../Modules/Utils");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
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
        const newNick = `Moderated Nickname ${Utils_1.id(36, 6)}`;
        if (typeof member === 'undefined') {
            return interaction.reply({
                embeds: [Embeds_1.fail('The user you specified isn\'t in this server, I can\'t change their nickname.')],
            });
        }
        if (member.roles.highest.position >= interaction.member?.roles.highest.position) {
            return interaction.reply({
                embeds: [Embeds_1.fail('You can\'t change the nickname of somebody above you!')],
            });
        }
        if (member.displayName.startsWith('Moderated Nickname')) {
            return interaction.reply({
                embeds: [Embeds_1.fail('That user\'s nickname is already moderated!')],
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
            await interaction.reply({ embeds: [Embeds_1.success(`Moderated ${member}'s nickname | \`${log.punishID}\``)] });
        })
            .catch((e) => interaction.reply({ embeds: [Embeds_1.fail(`I was unable to change ${member}'s nickname: ${e.message}`)] }));
    },
};
