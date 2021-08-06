"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    event: "interactionCreate",
    async run(client, interaction) {
        if (!interaction.isCommand())
            return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.run(interaction, interaction.options, client);
        }
        catch (err) {
            await interaction.reply({
                ephemeral: true,
                content: `Failed with error ${err}`
            });
        }
    }
};
