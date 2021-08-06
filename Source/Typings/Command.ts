import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { Client } from "../Modules/Client";

export interface Command {
  name: string;
  description: string;
  run(interaction: CommandInteraction, options: CommandInteractionOptionResolver, client: Client): Promise<unknown>;
}
