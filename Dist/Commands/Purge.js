"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const embeds_1 = require("../modules/embeds");
exports.command = {
    name: 'purge',
    description: 'Bulk deletes messages in the current channel.',
    options: [
        {
            type: 4,
            name: 'amount',
            description: 'Sets a limit on how many messages will be deleted',
            required: true,
        },
        {
            type: 6,
            name: 'user',
            description: 'Only include messages by a certain user.',
        },
        {
            type: 3,
            name: 'match',
            description: 'Only include messages that include some text.',
        },
        {
            type: 3,
            name: 'not',
            description: 'Only include messages that don\'t include some text.',
        },
        {
            type: 3,
            name: 'start',
            description: 'Only include messages that start with some text.',
        },
        {
            type: 3,
            name: 'end',
            description: 'Only include messages that end with some text.',
        },
        {
            type: 4,
            name: 'links',
            description: 'Only include messages that include links.',
            choices: [{ name: 'Enable', value: 1 }],
        },
        {
            type: 4,
            name: 'invites',
            description: 'Only include messages that include invite links.',
            choices: [{ name: 'Enable', value: 1 }],
        },
        {
            type: 4,
            name: 'images',
            description: 'Only include messages that have images attached.',
            choices: [{ name: 'Enable', value: 1 }],
        },
        {
            type: 4,
            name: 'embeds',
            description: 'Only include messages that have embeds attached.',
            choices: [{ name: 'Enable', value: 1 }],
        },
        {
            type: 4,
            name: 'bots',
            description: 'Only include messages sent by bots/humans.',
            choices: [
                { name: 'Only bots', value: 1 },
                { name: 'Only humans', value: 2 },
            ],
        },
    ],
    async allowed(interaction, client) {
        return ((interaction.guild &&
            interaction.member?.permissions?.has?.('MANAGE_MESSAGES')) ??
            false);
    },
    async run(interaction, options, client) {
        if (!interaction.channel ||
            !interaction.channel.isText() ||
            interaction.channel.type === 'DM') {
            return;
        }
        const amount = Math.min(options.getInteger('amount', true), 100);
        const user = options.getUser('user');
        const not = options.getString('not');
        const match = options.getString('match');
        const start = options.getString('start');
        const end = options.getString('end');
        const links = !!options.getInteger('links');
        const invites = !!options.getInteger('invites');
        const images = !!options.getInteger('images');
        const embeds = !!options.getInteger('images');
        const bots = options.getInteger('bots') ?? 0;
        const messages = (await interaction.channel.messages.fetch({
            limit: amount,
        }))
            .filter((m) => (user ? m.author.id === user.id : true))
            .filter((m) => (not ? !m.content.includes(not) : true))
            .filter((m) => (match ? m.content.includes(match) : true))
            .filter((m) => (start ? m.content.startsWith(start) : true))
            .filter((m) => (end ? m.content.endsWith(end) : true))
            .filter((m) => (links ? m.content.includes('https://') : true))
            .filter((m) => (invites ? m.content.includes('discord.gg/') : true))
            .filter((m) => (images ? m.attachments.size > 0 : true))
            .filter((m) => (embeds ? m.embeds.length > 0 : true))
            .filter((m) => (bots === 1 ? m.author.bot : true))
            .filter((m) => (bots === 2 ? !m.author.bot : true));
        if (!messages.size) {
            return interaction.reply({
                embeds: [embeds_1.fail('Found no messages matching your filter.')],
                ephemeral: true,
            });
        }
        await interaction.channel.bulkDelete(messages);
        return interaction.reply({
            embeds: [embeds_1.success(`Deleted ${messages.size} messages.`)],
            ephemeral: true,
        });
    },
};
