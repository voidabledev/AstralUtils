"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
exports.command = {
    name: 'serverinfo',
    description: 'View information about this server.',
    async run(interaction, options, client) {
        if (!interaction.guild)
            return;
        await interaction.guild.members.fetch();
        const { cache: members } = interaction.guild.members;
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }) ?? undefined)
            .setTitle('Member count')
            .setDescription(`${members.size}`)
            .setColor('RANDOM')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
