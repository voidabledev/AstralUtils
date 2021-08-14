"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'dm',
    description: 'Notify a user in DMs.',
    options: [
        {
            type: 6,
            name: 'user',
            description: 'The user to send the message to.',
            required: true,
        },
        {
            type: 3,
            name: 'message',
            description: 'The message to send.',
            required: true,
        },
        {
            type: 5,
            name: 'anonymous',
            description: 'Whether or not to hide your username.',
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('ADMINISTRATOR')) ?? false;
    },
    async run(interaction, options, client) {
        const user = options.getUser('user', true);
        const message = options.getString('message', true);
        const anon = options.getBoolean('anonymous') ?? false;
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Direct Message')
            .setDescription(`From **${interaction.guild?.name}**\n${message}`)
            .setFooter(`You were messaged by ${anon ? 'the Astral Galaxy Management Team' : interaction.user.tag}`);
        try {
            await user.send({ embeds: [embed] });
            await interaction.reply({ embeds: [embeds_1.success(`I've sent the message to ${user}!`)] });
        }
        catch (e) {
            await interaction.reply({ embeds: [embeds_1.fail(`I was unable to DM ${user}.`)] });
        }
    },
};
