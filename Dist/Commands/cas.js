"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'call-all-staff',
    description: 'Pings all staff members. Useful only in case of emergency.',
    options: [
        {
            name: 'text',
            description: 'Additional text to ping all staff members with.',
            type: 3,
        },
    ],
    async run(interaction, options, client) {
        const cooldown = client.globalCooldowns.get(exports.command.name);
        const now = new Date();
        const text = options.getString('text');
        if (cooldown && now.getTime() - cooldown.getTime() < 1000 * 60 * 60 * 2) {
            return interaction.reply({
                embeds: [embeds_1.fail(`This command is on cooldown. Try again <t:${Math.floor((cooldown.getTime() + 1000 * 60 * 60 * 2) / 1000)}:R>`)],
            });
        }
        try {
            await embeds_1.confirm(interaction, 'Are you sure you want to call all staff?');
            await embeds_1.confirm(interaction, 'This is only useful in case of an emergency, like a raid. Are you sure you want to proceed?');
            await embeds_1.confirm(interaction, 'Using this command with no reason will result in a harsh punishment. Do you really wish to ping all staff members?');
            await interaction.editReply({
                embeds: [embeds_1.success('Pinging all staff now...')],
                components: [],
            });
            await interaction.followUp({
                content: `<@&831996404549419018>${text ? `\n\`${text}\`` : ''}`,
            });
            client.globalCooldowns.set(exports.command.name, now);
        }
        catch {
            await interaction.editReply({
                embeds: [embeds_1.fail('Cancelled.')],
                components: [],
            });
        }
    },
};
