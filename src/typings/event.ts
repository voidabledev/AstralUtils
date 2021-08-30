import { ClientEvents } from 'discord.js';
import { Client } from '../modules/client';

export interface Event {
	event: keyof ClientEvents;
	once?: true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
	run(client: Client, ...args: any[]): Promise<void>;
}
