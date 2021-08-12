import { connect } from 'mongoose';
import config from '../config.json';
export const event = {
    event: 'ready',
    once: true,
    async run(client) {
        console.log(`Ready! Logged in as ${client.user?.tag}!`);
        await connect(config.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            keepAlive: true,
        });
        await client.economy.cache();
    },
};
