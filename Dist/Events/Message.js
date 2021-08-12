import { devs, token } from '../config.json';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
export const event = {
    event: 'messageCreate',
    async run(client, message) {
        if (message.content === '>deploy' && devs.includes(message.author.id)) {
            if (!client.user || !message.guild)
                return;
            const commands = client.commands.map(({ run, allowed, ...data }) => data);
            const rest = new REST({ version: '9' }).setToken(token);
            const start = Date.now();
            const msg = await message.channel.send('Refreshing slash commands...');
            try {
                await rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: commands });
                await msg.edit(`Refreshed ${commands.length} commands in ${Date.now() - start}ms.`);
            }
            catch (e) {
                await msg.edit(`Failed to refresh commands:\n${e.message}`);
            }
        }
    },
};
