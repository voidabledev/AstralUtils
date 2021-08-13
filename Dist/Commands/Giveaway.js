"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Embeds_1 = require("../Modules/Embeds");
exports.command = {
    name: 'giveaway',
    description: 'Creates a giveaway.',
    options: [
        {
            name: 'create',
            description: 'Create a new giveaway.',
            type: 1 /* Subcommand */,
            options: [
                {
                    name: 'prize',
                    description: 'The giveaway\'s prize',
                    type: 3 /* String */,
                    required: true,
                },
                {
                    name: 'duration',
                    description: 'The giveaway\'s duration',
                    type: 10 /* Number */,
                    required: true,
                },
                {
                    name: 'duration-unit',
                    description: 'The unit to specify the giveaway\'s duration in',
                    type: 4 /* Integer */,
                    required: true,
                    choices: [
                        { name: 'Minute(s)', value: 1000 * 60 },
                        { name: 'Hour(s)', value: 1000 * 60 * 60 },
                        { name: 'Day(s)', value: 1000 * 60 * 60 * 24 },
                    ],
                },
                {
                    name: 'winners',
                    description: 'The amount of winners for this giveaway',
                    type: 4 /* Integer */,
                    required: true,
                },
                {
                    name: 'sponsor',
                    description: 'The sponsor of this giveaway, if they are not the host',
                    type: 6 /* User */,
                },
                {
                    name: 'requirement',
                    description: 'The requirement for this giveaway, if any',
                    type: 3 /* String */,
                },
                {
                    name: 'ping',
                    description: 'What role to ping for the giveaway',
                    type: 3 /* String */,
                    choices: [
                        { name: 'None', value: '' },
                        { name: 'Giveaway Ping', value: '<@&831996472458477588>\n' },
                        { name: 'Nitro Giveaway Ping', value: '<@&831996471566008340>\n' },
                    ],
                },
            ],
        },
        {
            name: 'edit',
            description: 'Edit an existing  giveaway.',
            type: 1 /* Subcommand */,
            options: [
                {
                    name: 'message-id',
                    description: 'The ID of the giveaway\'s message.',
                    type: 3 /* String */,
                    required: true,
                },
                {
                    name: 'prize',
                    description: 'The giveaway\'s prize',
                    type: 3 /* String */,
                },
                {
                    name: 'duration',
                    description: 'The giveaway\'s duration',
                    type: 10 /* Number */,
                },
                {
                    name: 'duration-unit',
                    description: 'The unit to specify the giveaway\'s duration in',
                    type: 4 /* Integer */,
                    choices: [
                        { name: 'Minute(s)', value: 1000 * 60 },
                        { name: 'Hour(s)', value: 1000 * 60 * 60 },
                        { name: 'Day(s)', value: 1000 * 60 * 60 * 24 },
                    ],
                },
                {
                    name: 'winners',
                    description: 'The amount of winners for this giveaway',
                    type: 4 /* Integer */,
                },
                {
                    name: 'sponsor',
                    description: 'The sponsor of this giveaway, if they are not the host',
                    type: 6 /* User */,
                },
                {
                    name: 'requirement',
                    description: 'The requirement for this giveaway, if any',
                    type: 3 /* String */,
                },
            ],
        },
    ],
    async allowed(interaction, client) {
        return (interaction.member?.roles.cache.find((r) => r.name.endsWith('Giveaways')) !== undefined) || interaction.member?.permissions.has('MANAGE_MESSAGES');
    },
    async run(interaction, options, client) {
        if (!interaction.channel || !interaction.guild)
            return;
        const subcommand = options.getSubcommand(true);
        if (subcommand === 'create') {
            const prize = options.getString('prize', true);
            const duration = options.getNumber('duration', true) * options.getInteger('duration-unit', true);
            const winnerCount = options.getInteger('winners', true);
            const sponsor = options.getUser('sponsor') ?? undefined;
            const requirement = options.getString('requirement') ?? undefined;
            const ping = options.getString('ping') ?? '';
            if (winnerCount < 1 || winnerCount > 5)
                return interaction.reply({ embeds: [Embeds_1.fail('Giveaways have to have between 1 and 5 winners!')] });
            await client.giveaways.create({
                channelId: interaction.channel.id,
                guildId: interaction.guild.id,
                prize,
                start: Date.now(),
                end: Date.now() + duration,
                winnerCount,
                host: interaction.user.id,
                sponsor: sponsor?.id,
                requirement,
            }, `${ping}:tada: **GIVEAWAY** :tada:`, interaction);
        }
        if (subcommand === 'edit') {
            const messageId = options.getString('message-id', true);
            const prize = options.getString('prize') ?? undefined;
            const duration = options.getNumber('duration') ?? undefined;
            const durationUnit = options.getInteger('duration-unit') ?? 60_000;
            const winnerCount = options.getInteger('winners') ?? undefined;
            const sponsor = options.getUser('sponsor')?.id ?? undefined;
            const requirement = options.getString('requirement') ?? undefined;
            const end = duration ? Date.now() + duration * durationUnit : undefined;
            if (winnerCount && (winnerCount < 1 || winnerCount > 5))
                return interaction.reply({ embeds: [Embeds_1.fail('Giveaways have to have between 1 and 5 winners!')] });
            await client.giveaways.update(messageId, {
                prize,
                end,
                winnerCount,
                sponsor,
                requirement,
            }).then(() => interaction.reply({ embeds: [Embeds_1.success('Giveaway edited!')] }))
                .catch((e) => interaction.reply({ embeds: [Embeds_1.fail(e.message)] }));
        }
    },
};
