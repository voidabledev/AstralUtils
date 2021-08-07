"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
exports.command = {
    name: "balance",
    description: "Shows your balance",
    async run(interaction, options, client) {
        const coins = client.economy.getProfile(interaction.user.id);
        await interaction.reply({
            content: `${coins} coins.`
        });
    }
};
