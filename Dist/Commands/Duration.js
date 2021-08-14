"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'duration',
    description: 'Change a punishment\'s duration.',
    options: [
        {
            type: 3,
            name: 'punish-id',
            description: 'The punishment\'s ID',
            required: true,
        },
        {
            type: 4,
            name: 'time',
            description: 'The new expiration time.',
        },
        {
            type: 4,
            name: 'time-unit',
            description: 'The time unit to specify the expiration time in.',
            choices: [
                { name: 'Minute(s)', value: 1000 * 60 },
                { name: 'Hour(s)', value: 1000 * 60 * 60 },
                { name: 'Day(s)', value: 1000 * 60 * 24 },
            ],
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_ROLES')) ?? false;
    },
    async run(interaction, options, client) {
        const punishID = options.getString('punish-id', true);
        const expires = new Date().getTime() +
            options.getInteger('time', true) * options.getInteger('time-unit', true);
        const log = await client.modlogs.update(punishID, { expires });
        if (!log) {
            return interaction.reply({
                embeds: [embeds_1.fail('I couldn\'t find a punishment with this ID!')],
            });
        }
        await interaction.reply({
            embeds: [embeds_1.success(`The punishment with ID \`${punishID}\` now expires <t:${Math.floor(expires / 1000)}:R>.`)],
        });
    },
};
