"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
const utils_1 = require("./utils");
const economyManager_1 = require("../managers/economyManager");
const modlogManager_1 = require("../managers/modlogManager");
const giveawayManager_1 = require("../managers/giveawayManager");
const afkManager_1 = require("../managers/afkManager");
class Client extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    aliases = new discord_js_1.Collection();
    globalCooldowns = new discord_js_1.Collection();
    economy;
    modlogs;
    giveaways;
    afk;
    constructor(options) {
        super(options);
        this.economy = new economyManager_1.EconomyManager();
        this.modlogs = new modlogManager_1.ModlogManager(this);
        this.giveaways = new giveawayManager_1.GiveawayManager(this, 5000);
        this.afk = new afkManager_1.AfkManager();
    }
    async start() {
        this.login(config_json_1.token);
        const commandNames = await utils_1.search(`${__dirname}/../commands/**/*{.js,.ts}`);
        commandNames.forEach(async (name) => {
            const file = (await Promise.resolve().then(() => __importStar(require(name)))).command;
            this.commands.set(file.name, file);
        });
        const eventNames = await utils_1.search(`${__dirname}/../events/**/*{.js,.ts}`);
        eventNames.forEach(async (name) => {
            const file = (await Promise.resolve().then(() => __importStar(require(name)))).event;
            if (file.once)
                this.once(file.event, file.run.bind(null, this));
            else
                this.on(file.event, file.run.bind(null, this));
        });
        console.log(`Loaded ${commandNames.length} commands and ${eventNames.length} events.`);
    }
}
exports.Client = Client;
