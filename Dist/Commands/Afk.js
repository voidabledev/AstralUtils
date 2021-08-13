"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Embeds_1 = require("../Modules/Embeds");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
    name: 'afk',
    description: 'Marks you as AFK.',
    options: [
        {
            type: 3 /* String */,
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
            embeds: [Embeds_1.success(`Your AFK message has been set: \`${message}\``)],
        });
    },
};
