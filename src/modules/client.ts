import { Client as DJSClient, ClientOptions, Collection } from 'discord.js';
import { Command } from '../typings/command';
import { Event } from '../typings/event';
import { token } from '../config.json';
import { search } from './utils';
import { EconomyManager } from '../managers/economyManager';
import { ModlogManager } from '../managers/modlogManager';
import { GiveawayManager } from '../managers/giveawayManager';
import { AfkManager } from '../managers/afkManager';

export class Client extends DJSClient {
	commands = new Collection<string, Command>();
	aliases = new Collection<string, string>();
	globalCooldowns = new Collection<string, Date>();
	economy: EconomyManager;
	modlogs: ModlogManager;
	giveaways: GiveawayManager;
	afk: AfkManager;
	constructor(options: ClientOptions) {
		super(options);
		this.economy = new EconomyManager();
		this.modlogs = new ModlogManager(this);
		this.giveaways = new GiveawayManager(this, 5000);
		this.afk = new AfkManager();
	}

	async start(): Promise<void> {
		this.login(token);

		const commandNames: string[] = await search(
			`${__dirname}/../commands/**/*{.js,.ts}`,
		);
		commandNames.forEach(async (name) => {
			const file: Command = (await import(name)).command;

			this.commands.set(file.name, file);
		});

		const eventNames: string[] = await search(
			`${__dirname}/../events/**/*{.js,.ts}`,
		);
		eventNames.forEach(async (name) => {
			const file: Event = (await import(name)).event;

			if (file.once) this.once(file.event, file.run.bind(null, this));
			else this.on(file.event, file.run.bind(null, this));
		});

		console.log(
			`Loaded ${commandNames.length} commands and ${eventNames.length} events.`,
		);
	}
}
