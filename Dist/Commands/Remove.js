"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../Modules/Embeds");
// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.command = {
    name: 'remove',
    description: 'Removes a punishment.',
    options: [
        {
            type: 3 /* String */,
            name: 'punish-id',
            description: 'The punishment\'s ID',
            required: true,
        },
        {
            type: 3 /* String */,
            name: 'reason',
            description: 'The reason for removing this punishment.',
            required: true,
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_ROLES')) ?? false;
    },
    async run(interaction, options, client) {
        const punishID = options.getString('punish-id', true);
        const reason = options.getString('reason', true);
        const log = await client.modlogs.get(punishID);
        if (!log) {
            return interaction.reply({
                embeds: [Embeds_1.fail('I couldn\'t find a punishment with this ID!')],
            });
        }
        await Embeds_1.confirm(interaction, `Are you sure you want to remove this punishment?\n\n**Type:** ${log.caseType}\n**Moderator:** <@${log.staffID}> (${log.staffID})\n**User:** <@${log.userID}> (${log.userID})\n**Reason:** ${log.reason}`)
            .then(async () => {
            await client.modlogs.delete(punishID);
            await interaction.editReply({
                embeds: [Embeds_1.success(`Removed punishment \`${punishID}\` for \`${reason}\`.`)],
                components: [],
            });
            if (!client.user)
                return;
            const logChannel = client.channels.cache.get('851883465364078632');
            const logEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Punishment Removed')
                .addField('Removed For', reason)
                .addField('Type', log.caseType)
                .addField('Moderator', `<@${log.staffID}> (${log.staffID})`)
                .addField('User', `<@${log.userID}> (${log.userID})`)
                .addField('Reason', log.reason)
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
                embeds: [Embeds_1.fail('Cancelled.')],
                components: [],
            });
        });
    },
};
