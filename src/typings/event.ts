import { ClientEvents } from 'discord.js';
import { Client } from '../modules/client';

export interface Event {
  event: keyof ClientEvents;
  once?: true;
  run(client: Client, ...args: any[]): Promise<void>;
}
