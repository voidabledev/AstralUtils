"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
    name: 'say',
    description: 'Announce something.',
    options: [
        {
            type: 3 /* String */,
            name: 'message',
            description: 'The message to announce.',
            required: true,
        },
        {
            type: 5 /* Boolean */,
            name: 'anonymous',
            description: 'Whether or not to hide your username.',
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('ADMINISTRATOR')) ?? false;
    },
    async run(interaction, options, client) {
        const message = options.getString('message', true);
        const anon = options.getBoolean('anonymous') ?? false;
        const author = anon && client.user ? client.user : interaction.user;
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(author.username, author.avatarURL({ dynamic: true }) ?? undefined)
            .setDescription(message)
            .setFooter(anon ? 'Astral Galaxy Management Team' : `Sent by: ${interaction.user.tag}`);
        await interaction.reply({ embeds: [embed] });
    },
};
