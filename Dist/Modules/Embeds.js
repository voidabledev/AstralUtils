"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePages = exports.pageMenu = exports.confirm = exports.fail = exports.success = void 0;
const discord_js_1 = require("discord.js");
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
    const { id } = interaction;
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
    const message = await interaction.fetchReply();
    const confirmFilter = (i) => i.user.id === interaction.user.id && i.customId === `confirm-${id}`;
    const cancelFilter = (i) => i.user.id === interaction.user.id && i.customId === `cancel-${id}`;
    const confirmCollector = message.createMessageComponentCollector({
        filter: confirmFilter,
        time: 15000,
    });
    const cancelCollector = message.createMessageComponentCollector({
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
async function pageMenu(interaction, pages) {
    if (!pages.length)
        throw new Error('Cannot make an empty page menu');
    const { id } = interaction;
    const replyFn = interaction.deferred || interaction.replied ? 'editReply' : 'reply';
    let page = 0;
    const row = new discord_js_1.MessageActionRow()
        .addComponents(new discord_js_1.MessageButton().setStyle('PRIMARY').setEmoji('874288086048206899').setCustomId(`first-${id}`).setDisabled(page === 0), new discord_js_1.MessageButton().setStyle('PRIMARY').setEmoji('874288033002840125').setCustomId(`back-${id}`).setDisabled(page === 0), new discord_js_1.MessageButton().setStyle('PRIMARY').setEmoji('874287989746966588').setCustomId(`next-${id}`).setDisabled(page === pages.length - 1), new discord_js_1.MessageButton().setStyle('PRIMARY').setEmoji('874288058877480981').setCustomId(`last-${id}`).setDisabled(page === pages.length - 1), new discord_js_1.MessageButton().setStyle('DANGER').setEmoji('836302929781981265').setCustomId(`end-${id}`));
    await interaction[replyFn]({
        embeds: [pages[page]],
        components: [row],
    });
    const message = (await interaction.fetchReply());
    const collectors = [];
    row.components.forEach((comp) => {
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id && i.customId === comp.customId,
            time: 60000,
        });
        collectors.push(collector);
    });
    async function updateButtons() {
        row.components[0].setDisabled(page === 0);
        row.components[1].setDisabled(page === 0);
        row.components[2].setDisabled(page === pages.length - 1);
        row.components[3].setDisabled(page === pages.length - 1);
        await interaction.editReply({
            embeds: [pages[page]],
            components: [row],
        });
    }
    collectors[0].on('collect', async (i) => {
        await i.deferUpdate();
        page = 0;
        await updateButtons();
    });
    collectors[1].on('collect', async (i) => {
        await i.deferUpdate();
        page--;
        await updateButtons();
    });
    collectors[2].on('collect', async (i) => {
        await i.deferUpdate();
        page++;
        await updateButtons();
    });
    collectors[3].on('collect', async (i) => {
        await i.deferUpdate();
        page = pages.length - 1;
        await updateButtons();
    });
    collectors[4].on('collect', async (i) => {
        await i.deferUpdate();
        collectors.forEach((c) => c.stop());
    });
    return new Promise((resolve) => {
        collectors[0].on('end', async () => {
            await interaction.editReply({
                components: [],
            });
            resolve();
        });
    });
}
exports.pageMenu = pageMenu;
function parsePages(fields, options) {
    const maxPage = Math.floor((fields.length - 1) / 10);
    const pages = new Array(maxPage + 1);
    let i = 0;
    while (i <= maxPage) {
        pages[i] = new discord_js_1.MessageEmbed(options);
        pages[i].setFooter(`Page ${i + 1}/${maxPage + 1}`)
            .spliceFields(0, pages[i].fields.length, fields.slice(10 * i, 10 * (i + 1)));
        i++;
    }
    return pages;
}
exports.parsePages = parsePages;
