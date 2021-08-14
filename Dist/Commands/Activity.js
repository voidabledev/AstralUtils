"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const config_json_1 = require("../config.json");
exports.command = {
    name: 'activity',
    description: 'Sets the bot\'s status.',
    options: [
        {
            type: 3,
            name: 'status',
            description: 'The bot\'s status.',
            choices: [
                { name: 'Online', value: 'online' },
                { name: 'Idle', value: 'idle' },
                { name: 'DND (Do not disturb)', value: 'dnd' },
                { name: 'Invisible', value: 'invisible' },
            ],
        },
        {
            type: 3,
            name: 'type',
            description: 'Type of the activity.',
            choices: [
                { name: 'Playing', value: 'PLAYING' },
                { name: 'Streaming', value: 'STREAMING' },
                { name: 'Listening to', value: 'LISTENING' },
                { name: 'Watching', value: 'WATCHING' },
                { name: 'Competing in', value: 'COMPETING' },
            ],
        },
        {
            type: 3,
            name: 'name',
            description: 'Name of the activity.',
        },
        {
            type: 3,
            name: 'url',
            description: 'Stream URL',
        },
    ],
    async allowed(interaction, client) {
        return config_json_1.devs.includes(interaction.user.id);
    },
    async run(interaction, options, client) {
        const status = options.getString('status') ?? undefined;
        const type = options.getString('type') ?? undefined;
        const name = options.getString('name') ?? undefined;
        const url = options.getString('url') ?? undefined;
        try {
            client.user?.setPresence({
                status,
                activities: [{
                        type,
                        name,
                        url,
                    }],
            });
            interaction.reply({
                content: 'Status has been set!',
                ephemeral: true,
            });
        }
        catch (e) {
            interaction.reply({
                content: `Failed to set status:\n${e.message}`,
                ephemeral: true,
            });
        }
    },
};
