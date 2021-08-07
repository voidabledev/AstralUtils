import { Command } from "../Typings/Command";

export const command: Command = {
  name: "balance",
  description: "Shows your balance",
  async run(interaction, options, client) {
    const coins = client.economy.getProfile(interaction.user.id);

    await interaction.reply({
      content: `${coins} coins.`
    });
  }
};
