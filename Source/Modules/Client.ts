import { Client as DJSClient, ClientOptions, Collection } from 'discord.js';
import { Command } from '../Typings/Command';
import { Event } from '../Typings/Event';
import { token } from '../config.json';
import { search } from './Utils';
import { EconomyManager } from '../Managers/EconomyManager';

export class Client extends DJSClient {
	commands = new Collection<string, Command>();
	aliases = new Collection<string, string>();
	economy: EconomyManager;
	constructor(options: ClientOptions) {
		super(options);
		this.economy = new EconomyManager(this);
	}

	async start(): Promise<void> {
		this.login(token);

		const commandNames: string[] = await search(`${__dirname}/../Commands/**/*{.js,.ts}`);
		commandNames.forEach(async name => {
			const file: Command = (await import(name)).command;

			this.commands.set(file.name, file);
		});

		const eventNames: string[] = await search(`${__dirname}/../Events/**/*{.js,.ts}`);
		eventNames.forEach(async name => {
			const file: Event = (await import(name)).event;

			if (file.once) this.once(file.event, file.run.bind(null, this));
			else this.on(file.event, file.run.bind(null, this));
		});

		console.log(`Loaded ${commandNames.length} commands and ${eventNames.length} events.`);
	}
}
