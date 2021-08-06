"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
const mongoose_1 = require("mongoose");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
    ]
});
client.once('ready', () => console.log(`Ready! Logged in as ${client.user?.tag}!`));
mongoose_1.connect(config_json_1.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    keepAlive: true,
});
client.login(config_json_1.token);
