import { Command } from "../Typings/Command";

export const command: Command = {
  name: "ping",
  description: "Gets the bot's ping.",
  async run(interaction, options, client) {
    await interaction.reply({
      content: `🏓 Pong! ${client.ws.ping}ms.`
    });
  }
};
