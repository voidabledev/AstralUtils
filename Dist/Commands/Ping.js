export const command = {
    name: 'ping',
    description: 'Gets the bot\'s ping.',
    async run(interaction, options, client) {
        await interaction.reply({
            content: `🏓 Pong! ${client.ws.ping}ms.`,
        });
    },
};
