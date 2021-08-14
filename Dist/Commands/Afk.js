"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'afk',
    description: 'Marks you as AFK.',
    options: [
        {
            type: 3,
            name: 'message',
            description: 'Your AFK message',
            required: true,
        },
    ],
    async run(interaction, options, client) {
        const message = options.getString('message', true);
        if (!interaction.member)
            return;
        client.afk.set(interaction.member, message);
        return interaction.reply({
            embeds: [embeds_1.success(`Your AFK message has been set: \`${message}\``)],
        });
    },
};
