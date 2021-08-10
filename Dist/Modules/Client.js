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
const Utils_1 = require("./Utils");
const EconomyManager_1 = require("../Managers/EconomyManager");
const ModlogManager_1 = require("../Managers/ModlogManager");
const GiveawayManager_1 = require("../Managers/GiveawayManager");
class Client extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    aliases = new discord_js_1.Collection();
    globalCooldowns = new discord_js_1.Collection();
    economy;
    modlogs;
    giveaways;
    constructor(options) {
        super(options);
        this.economy = new EconomyManager_1.EconomyManager();
        this.modlogs = new ModlogManager_1.ModlogManager(this);
        this.giveaways = new GiveawayManager_1.GiveawayManager(this, 5000);
    }
    async start() {
        this.login(config_json_1.token);
        const commandNames = await Utils_1.search(`${__dirname}/../Commands/**/*{.js,.ts}`);
        commandNames.forEach(async (name) => {
            const file = (await Promise.resolve().then(() => __importStar(require(name)))).command;
            this.commands.set(file.name, file);
        });
        const eventNames = await Utils_1.search(`${__dirname}/../Events/**/*{.js,.ts}`);
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
