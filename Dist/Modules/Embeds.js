"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
const discord_js_1 = require("discord.js");
function success(message, footer) {
    const embed = new discord_js_1.MessageEmbed()
        .setDescription(`<a:yes:836302807485251674> ${message}`)
        .setColor('GREEN');
    if (footer)
        embed.setFooter(footer);
    return embed;
}
exports.success = success;
function fail(message, footer) {
    const embed = new discord_js_1.MessageEmbed()
        .setDescription(`<a:no:836302929781981265> ${message}`)
        .setColor('RED');
    if (footer)
        embed.setFooter(footer);
    return embed;
}
exports.fail = fail;
// TODO: Implement these embeds into commands
// TODO: Make a prompt embed with cancel / confirm button handling
