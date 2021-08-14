import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { APIApplicationCommandOption } from 'discord-api-types/v9';
import { Client } from '../modules/client';

export interface Command {
	/** The command's unique name (1-32 lowercase characters) */
  name: string;
	/** A description for the command, displayed in the command menu. */
  description: string;
	/** Options the user can or must specify. */
	options?: APIApplicationCommandOption[],
	/** A check that is run before the command to allow or deny access. */
	allowed?(interaction: CommandInteraction, client: Client): Promise<boolean>,
	/** The main command's code, run whenever a user who has access runs the command. */
  run(interaction: CommandInteraction, options: CommandInteractionOptionResolver, client: Client): Promise<unknown>;
}
