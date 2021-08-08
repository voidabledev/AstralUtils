"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./Modules/Client");
const discord_js_1 = require("discord.js");
const client = new Client_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_BANS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
    ],
});
client.start();
