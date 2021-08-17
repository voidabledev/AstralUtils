import { Message } from 'discord.js';
export interface Automod {
	triggers: { name: string; type: string }[];
	allowed: (message: Message) => Promise<boolean>;
	execute: (message: Message) => Promise<unknown>;
}
