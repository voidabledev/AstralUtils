"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'wipe',
    description: 'Removes all punishments a user has.',
    options: [
        {
            type: 6,
            name: 'user',
            description: 'The user to wipe punishments for.',
            required: true,
        },
        {
            type: 3,
            name: 'reason',
            description: 'The reason for removing punishments.',
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_ROLES')) ?? false;
    },
    async run(interaction, options, client) {
        const user = options.getUser('user', true);
        const reason = options.getString('reason', true);
        const logs = await client.modlogs.getUser(user.id);
        if (!logs.length) {
            return interaction.reply({
                embeds: [embeds_1.fail('I found no punishments to remove!')],
            });
        }
        await embeds_1.confirm(interaction, `Are you sure you want to delete all \`${logs.length}\` punishments for ${user}?`)
            .then(async () => {
            await client.modlogs.deleteMany(logs.map((l) => l.punishID));
            await interaction.editReply({
                embeds: [embeds_1.success(`Removed \`${logs.length}\` punishments for \`${reason}\`.`)],
                components: [],
            });
            if (!client.user)
                return;
            const logChannel = client.channels.cache.get('851883465364078632');
            const logEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Punishments Removed')
                .addField('Removed for', reason)
                .addField('Removed amount', `${logs.length}`)
                .addField('User', `<@${user.id}> (${user.id})`)
                .setColor('RANDOM')
                .setFooter(`Deleted by: ${interaction.user.tag} (${interaction.user.id})`);
            const webhooks = await logChannel.fetchWebhooks();
            const webhook = webhooks.size ? webhooks.first() : await logChannel.createWebhook(client.user.username, {
                avatar: client.user.avatarURL() ?? undefined,
            });
            webhook?.send({
                username: client.user.username,
                avatarURL: client.user.avatarURL() ?? undefined,
                embeds: [logEmbed],
            });
        })
            .catch(async () => {
            await interaction.editReply({
                embeds: [embeds_1.fail('Cancelled.')],
                components: [],
            });
        });
    },
};
