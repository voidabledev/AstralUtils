"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Embeds_1 = require("../Modules/Embeds");
exports.event = {
    event: 'interactionCreate',
    async run(client, interaction) {
        if (!interaction.isButton())
            return;
        if (interaction.customId.startsWith('control-giveaway-')) {
            await client.giveaways.displayControl(interaction);
        }
        if (interaction.customId.startsWith('enter-giveaway-')) {
            const msg = await client.giveaways.enter(interaction.customId.replace('enter-giveaway-', ''), interaction.user.id);
            if (msg === 'Entered!')
                return await interaction.reply({ embeds: [Embeds_1.success(msg)], ephemeral: true });
            return await interaction.reply({ embeds: [Embeds_1.fail(msg)], ephemeral: true });
        }
        if (interaction.customId.startsWith('reroll-giveaway-')) {
            client.giveaways.reroll(interaction.customId.replace('reroll-giveaway-', ''), interaction)
                .then(() => interaction.editReply({ embeds: [Embeds_1.success('Giveaway rerolled!')], components: [] }))
                .catch(() => interaction.editReply({ embeds: [Embeds_1.fail('Cancelled.')], components: [] }));
        }
        if (interaction.customId.startsWith('end-giveaway-')) {
            client.giveaways.end(interaction.customId.replace('end-giveaway-', ''));
            return await interaction.reply({ embeds: [Embeds_1.success('Giveaway ended!')], ephemeral: true });
        }
        if (interaction.customId.startsWith('delete-giveaway-')) {
            client.giveaways.delete(interaction.customId.replace('delete-giveaway-', ''));
            return interaction.reply({ embeds: [Embeds_1.success('Giveaway deleted!')], ephemeral: true });
        }
    },
};
