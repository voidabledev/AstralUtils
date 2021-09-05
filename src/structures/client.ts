import { Client as DJSClient, ClientOptions, Collection, Message } from 'discord.js';
import { Command } from '../typings/command';
import { Event } from '../typings/event';
import { token, db } from '../config.json';
import { search } from './utils';
import { EconomyManager } from '../managers/economyManager';
import { ModlogManager } from '../managers/modlogManager';
import { GiveawayManager } from '../managers/giveawayManager';
import { ModmailManager } from '../managers/modmailManager';
import { AfkManager } from '../managers/afkManager';
import { AutomodManager } from '../managers/automodManager';
import { connect, connection } from 'mongoose';

export class Client extends DJSClient {
	commands = new Collection<string, Command>();
	aliases = new Collection<string, string>();
	globalCooldowns = new Collection<string, Date>();
	userCooldowns = new Collection<string, Collection<string, Date>>();
	snipes = {
		deleted: new Collection<string, Message>(),
		edited: new Collection<string, [Message, Message]>(),
	}
	economy: EconomyManager;
	modlogs: ModlogManager;
	giveaways: GiveawayManager;
	afk: AfkManager;
	automod: AutomodManager;
	modmail: ModmailManager;
	constructor(options: ClientOptions) {
		super(options);
		this.economy = new EconomyManager();
		this.modlogs = new ModlogManager(this);
		this.giveaways = new GiveawayManager(this, 5000);
		this.afk = new AfkManager();
		this.automod = new AutomodManager(this);
		this.modmail = new ModmailManager(this);
	}
	async start(): Promise<void> {
		connection.on('connected', () => console.log('Connected to mongoose!'));
		connection.on('disconnected', () =>
			console.log('Lost connection to mongoose.'),
		);
		await connect(db, {
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		this.login(token);
		const commandNames: string[] = await search(
			`${__dirname}/../commands/**/**/*{.js,.ts}`,
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
