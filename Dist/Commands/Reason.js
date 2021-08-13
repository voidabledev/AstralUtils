"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Embeds_1 = require("../Modules/Embeds");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
    name: 'reason',
    description: 'Change a punishment\'s reason.',
    options: [
        {
            type: 3 /* String */,
            name: 'punish-id',
            description: 'The punishment\'s ID',
            required: true,
        },
        {
            type: 3 /* String */,
            name: 'reason',
            description: 'The new reason for this punishment.',
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_ROLES')) ?? false;
    },
    async run(interaction, options, client) {
        const punishID = options.getString('punish-id', true);
        const reason = options.getString('reason', true);
        const log = await client.modlogs.update(punishID, { reason });
        if (!log) {
            return interaction.reply({
                embeds: [Embeds_1.fail('I couldn\'t find a punishment with this ID!')],
            });
        }
        await interaction.reply({
            embeds: [Embeds_1.success(`Changed the reason of punishment \`${punishID}\` from \`${log.reason}\` to \`${reason}\`.`)],
        });
    },
};
