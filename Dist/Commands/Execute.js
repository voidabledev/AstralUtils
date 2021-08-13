"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const config_json_1 = require("../config.json");
const discord_js_1 = require("discord.js");
const child_process_1 = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.command = {
    name: 'exec',
    description: 'Executes shell code [Developers only]',
    options: [
        {
            type: 3 /* String */,
            name: 'code',
            description: 'The code to execute.',
            required: true,
        },
        {
            type: 5 /* Boolean */,
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
            .setTitle('Shell Execution')
            .addField('Input', '```sh\n' + code + '\n```')
            .setFooter('Status: Success')
            .setColor('ORANGE');
        child_process_1.exec(code, async (err, stdout, stderr) => {
            if (stdout.length) {
                embed
                    .addField('Output', '```\n' + stdout.slice(0, 1000) + (stdout.length > 1000 ? '...' : '') + '\n```')
                    .setColor('GREEN');
            }
            if (stderr.length) {
                embed
                    .addField('Error', '```\n' + stderr.slice(0, 1000) + (stderr.length > 1000 ? '...' : '') + '\n```')
                    .setFooter('Status: Failed')
                    .setColor('RED');
            }
            interaction.followUp({ embeds: [embed] });
        });
    },
};
