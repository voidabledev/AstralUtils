"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = exports.fail = exports.success = void 0;
const discord_js_1 = require("discord.js");
const Utils_1 = require("./Utils");
// TODO: Implement these embeds into commands
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
async function confirm(interaction, prompt, ephemeral) {
    const replyFn = interaction.deferred || interaction.replied ? 'editReply' : 'reply';
    ephemeral ??= false;
    const id = Utils_1.id(10, 5);
    const promptEmbed = new discord_js_1.MessageEmbed()
        .setDescription(`<a:loading:855829253429264405> ${prompt}`)
        .setColor('ORANGE');
    const row = new discord_js_1.MessageActionRow()
        .addComponents(new discord_js_1.MessageButton().setLabel('Confirm').setStyle('SUCCESS').setCustomId(`confirm-${id}`), new discord_js_1.MessageButton().setLabel('Cancel').setStyle('DANGER').setCustomId(`cancel-${id}`));
    await interaction[replyFn]({
        embeds: [promptEmbed],
        components: [row],
        ephemeral,
    });
    const confirmFilter = (i) => i.user.id === interaction.user.id && i.customId === `confirm-${id}`;
    const cancelFilter = (i) => i.user.id === interaction.user.id && i.customId === `cancel-${id}`;
    const confirmCollector = interaction.channel?.createMessageComponentCollector({
        filter: confirmFilter,
        time: 15000,
    });
    const cancelCollector = interaction.channel?.createMessageComponentCollector({
        filter: cancelFilter,
        time: 15000,
    });
    return new Promise((resolve, reject) => {
        confirmCollector?.on('collect', async (i) => {
            await i.deferUpdate();
            resolve();
        });
        cancelCollector?.on('collect', async (i) => {
            await i.deferUpdate();
            reject();
        });
        cancelCollector?.on('end', () => {
            reject();
        });
    });
}
exports.confirm = confirm;
