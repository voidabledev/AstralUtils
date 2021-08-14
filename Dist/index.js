"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./modules/client");
const discord_js_1 = require("discord.js");
const client = new client_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_BANS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
    ],
});
client.start();
