import { Client as DJSClient, Collection } from 'discord.js';
import { token } from '../config.json';
import { search } from './Utils';
import { EconomyManager } from '../Managers/EconomyManager';
import { ModlogManager } from '../Managers/ModlogManager';
import { GiveawayManager } from '../Managers/GiveawayManager';
export class Client extends DJSClient {
    commands = new Collection();
    aliases = new Collection();
    globalCooldowns = new Collection();
    economy;
    modlogs;
    giveaways;
    constructor(options) {
        super(options);
        this.economy = new EconomyManager();
        this.modlogs = new ModlogManager(this);
        this.giveaways = new GiveawayManager(this, 5000);
    }
    async start() {
        this.login(token);
        const commandNames = await search(`${__dirname}/../Commands/**/*{.js,.ts}`);
        commandNames.forEach(async (name) => {
            const file = (await import(name)).command;
            this.commands.set(file.name, file);
        });
        const eventNames = await search(`${__dirname}/../Events/**/*{.js,.ts}`);
        eventNames.forEach(async (name) => {
            const file = (await import(name)).event;
            if (file.once)
                this.once(file.event, file.run.bind(null, this));
            else
                this.on(file.event, file.run.bind(null, this));
        });
        console.log(`Loaded ${commandNames.length} commands and ${eventNames.length} events.`);
    }
}
