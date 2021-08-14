"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const config_json_1 = require("../config.json");
const discord_js_1 = require("discord.js");
const typescript_1 = require("typescript");
exports.command = {
    name: 'eval',
    description: 'Evaluates TS code [Developers only]',
    options: [
        {
            type: 3,
            name: 'code',
            description: 'The code to evaluate.',
            required: true,
        },
        {
            type: 5,
            name: 'ephemeral',
            description: '"Only you can see this."',
        },
    ],
    async allowed(interaction, client) {
        return config_json_1.devs.includes(interaction.user.id);
    },
    async run(interaction, options, client) {
        const ephemeral = options.getBoolean('ephemeral') ?? true;
        const ts = options.getString('code', true);
        await interaction.deferReply({ ephemeral });
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Eval result')
            .addField('Input', '```ts\n' + ts + '\n```');
        try {
            const transpiled = typescript_1.transpileModule(ts, { reportDiagnostics: true, compilerOptions: { noEmitOnError: true, target: typescript_1.ScriptTarget.ESNext } });
            if (transpiled.diagnostics?.length) {
                throw new Error(transpiled.diagnostics.map((d) => `${d.start}: ${d.messageText}`).join('\n'));
            }
            const js = transpiled.outputText;
            embed.addField('Transpiled input', '```js\n' + js + '\n```');
            let result = await eval(js);
            let encoding = '```js\n';
            if (typeof result === 'object') {
                result = JSON.stringify(result, null, 2);
                encoding = '```json\n';
            }
            embed
                .addField('Output', encoding + result + '\n```')
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
