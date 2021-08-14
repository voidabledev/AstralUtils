"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'mute',
    description: 'Mutes a user.',
    options: [
        {
            type: 6,
            name: 'user',
            description: 'The user to mute.',
            required: true,
        },
        {
            type: 3,
            name: 'reason',
            description: 'The reason for this mute',
            required: true,
        },
        {
            type: 4,
            name: 'time',
            description: 'The time after which this mute expires, if any.',
        },
        {
            type: 4,
            name: 'time-unit',
            description: 'The time unit to specify the expiration time in.',
            choices: [
                { name: 'Minute(s)', value: 1000 * 60 },
                { name: 'Hour(s)', value: 1000 * 60 * 60 },
                { name: 'Day(s)', value: 1000 * 60 * 24 },
            ],
        },
    ],
    async allowed(interaction, client) {
        return (interaction.guild && interaction.member?.permissions?.has?.('MANAGE_MESSAGES')) ?? false;
    },
    async run(interaction, options, client) {
        const member = options.getMember('user');
        const reason = options.getString('reason', true);
        const time = options.getInteger('time');
        const timeUnit = options.getInteger('time-unit') ?? 60000;
        if (typeof member === 'undefined') {
            return interaction.reply({
                embeds: [embeds_1.fail('I can\'t mute someone not in the server.')],
            });
        }
        if (member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                embeds: [embeds_1.fail('You can\'t mute a moderator/admin!')],
            });
        }
        let role = interaction.guild?.roles.cache.find((r) => r.name === 'Muted');
        const createRole = typeof role === 'undefined';
        if (!member?.manageable) {
            return interaction.reply({
                embeds: [embeds_1.fail('I can\'t mute this user!')],
            });
        }
        if (role && member.roles.cache.has(role.id)) {
            return interaction.reply({
                embeds: [embeds_1.fail(`${member} is already muted!`)],
            });
        }
        await embeds_1.confirm(interaction, `Are you sure you want to mute ${member}? ${createRole ? 'A "Muted" role will be created' : ''}`)
            .then(async () => {
            if (createRole) {
                role = await interaction.guild.roles.create({
                    name: 'Muted',
                    color: '#818386',
                    hoist: false,
                });
                interaction.guild?.channels.cache.each((c) => {
                    if (c.type === 'GUILD_TEXT' ||
                        c.type === 'GUILD_CATEGORY' ||
                        c.type === 'GUILD_NEWS') {
                        c.permissionOverwrites.create(role, {
                            VIEW_CHANNEL: false,
                            SEND_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false,
                            ADD_REACTIONS: false,
                            USE_PUBLIC_THREADS: false,
                            USE_PRIVATE_THREADS: false,
                        });
                    }
                    if (c.type === 'GUILD_VOICE' || c.type === 'GUILD_STAGE_VOICE') {
                        c.permissionOverwrites.create(role, {
                            CONNECT: false,
                            SPEAK: false,
                        });
                    }
                });
            }
            const userEmbed = new discord_js_1.MessageEmbed()
                .setTitle(`You've been muted in **${interaction.guild?.name}**`)
                .addField('Reason', reason)
                .addField('Expires', time ? `<t:${Math.floor((new Date().getTime() + time * timeUnit) / 1000)}:R>` : 'Permanent')
                .setColor('RED');
            await member.user.send({
                embeds: [userEmbed],
            }).catch(() => { });
            await member.roles.add(role);
            const log = await client.modlogs.set({
                guildID: interaction.guild.id,
                userID: member.id,
                staffID: interaction.user.id,
                reason,
                caseType: 'Mute',
                expires: time ? new Date().getTime() + time * timeUnit : undefined,
                isActive: true,
            });
            await interaction.editReply({
                embeds: [embeds_1.success(`${member} has been **muted** | \`${log.punishID}\``)],
                components: [],
            });
        })
            .catch(() => {
            interaction.editReply({
                embeds: [embeds_1.fail('Cancelled.')],
                components: [],
            });
        });
    },
};
