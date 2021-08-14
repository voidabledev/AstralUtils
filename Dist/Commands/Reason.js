"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'reason',
    description: 'Change a punishment\'s reason.',
    options: [
        {
            type: 3,
            name: 'punish-id',
            description: 'The punishment\'s ID',
            required: true,
        },
        {
            type: 3,
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
                embeds: [embeds_1.fail('I couldn\'t find a punishment with this ID!')],
            });
        }
        await interaction.reply({
            embeds: [embeds_1.success(`Changed the reason of punishment \`${punishID}\` from \`${log.reason}\` to \`${reason}\`.`)],
        });
    },
};
