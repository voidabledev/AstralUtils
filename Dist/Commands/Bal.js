export const command = {
    name: 'balance',
    description: 'Shows your balance',
    async run(interaction, options, client) {
        const { coins } = client.economy.getProfile(interaction.user.id);
        await interaction.reply({
            content: `${coins} coins.`,
        });
    },
};
