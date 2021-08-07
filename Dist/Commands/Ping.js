"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
exports.command = {
    name: 'ping',
    description: 'Gets the bot\'s ping.',
    async run(interaction, options, client) {
        await interaction.reply({
            content: `🏓 Pong! ${client.ws.ping}ms.`,
        });
    },
};
