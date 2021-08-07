"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const config_json_1 = require("../config.json");
const discord_js_1 = require("discord.js");
const v9_1 = require("discord-api-types/v9");
exports.command = {
    name: 'eval',
    description: 'Executes code [Developers only]',
    options: [
        {
            type: v9_1.ApplicationCommandOptionType.String,
            name: 'code',
            description: 'The code to execute.',
            required: true,
        },
        {
            type: v9_1.ApplicationCommandOptionType.Boolean,
            name: 'ephemeral',
            description: '"Only you can see this."',
        },
    ],
    async allowed(interaction, client) {
        return config_json_1.devs.includes(interaction.user.id);
    },
    async run(interaction, options, client) {
        const ephemeral = options.getBoolean('ephemeral') ?? true;
        const code = options.getString('code', true);
        await interaction.deferReply({ ephemeral });
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Eval result')
            .addField('Input', '```js\n' + code + '\n```');
        try {
            const result = await eval(code);
            embed
                .addField('Output', '```js\n' + result + '\n```')
                .setFooter('Status: Success')
                .setColor('GREEN');
        }
        catch (e) {
            embed
                .addField('Error', '```js\n' + e.message + '\n```')
                .setFooter('Status: Failed')
                .setColor('RED');
        }
        await interaction.followUp({
            embeds: [embed],
            ephemeral,
        });
    },
};
