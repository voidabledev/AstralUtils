"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
exports.event = {
    event: 'messageCreate',
    async run(client, message) {
        if (message.content === '>deploy' && config_json_1.devs.includes(message.author.id)) {
            if (!client.user || !message.guild)
                return;
            const commands = client.commands.map(({ run, allowed, ...data }) => data);
            const rest = new rest_1.REST({ version: '9' }).setToken(config_json_1.token);
            const start = Date.now();
            const msg = await message.channel.send('Refreshing slash commands...');
            try {
                await rest.put(v9_1.Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: commands });
                await msg.edit(`Refreshed ${commands.length} commands in ${Date.now() - start}ms.`);
            }
            catch (e) {
                await msg.edit(`Failed to refresh commands:\n${e.message}`);
            }
        }
        if (message.member && client.afk.get(message.author.id)) {
            await client.afk.unset(message.member);
            const embed = new discord_js_1.MessageEmbed()
                .setDescription(`Welcome back ${message.member}, I removed your AFK.`)
                .setColor('GREEN');
            message
                .reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false },
            })
                .then((m) => setTimeout(() => m.delete(), 5000));
        }
        const afk = client.afk.get(message.mentions.members?.first()?.id ?? '');
        if (afk) {
            const embed = new discord_js_1.MessageEmbed()
                .setDescription(`<@${afk.userId}> is AFK: \`${afk.message}\``)
                .setColor('RED');
            message
                .reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false },
            })
                .then((m) => setTimeout(() => m.delete(), 5000));
        }
    },
};
