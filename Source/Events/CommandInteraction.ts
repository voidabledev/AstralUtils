import { Interaction } from "discord.js";
import { Event } from "../Typings/Event";

export const event: Event = {
  event: "interactionCreate",
  async run(client, interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run(interaction, interaction.options, client);
    } catch (err) {
      await interaction.reply({
        ephemeral: true,
        content: `Failed with error ${err}`
      });
    }
  }
};
