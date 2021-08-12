import { model, Schema } from 'mongoose';
const schema = new Schema({
    messageId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    entries: {
        type: [String],
        required: true,
    },
    prize: {
        type: String,
        required: true,
    },
    start: {
        type: Number,
        required: true,
    },
    end: {
        type: Number,
        required: true,
    },
    winnerCount: {
        type: Number,
        required: true,
    },
    ended: {
        type: Boolean,
        required: true,
    },
    host: {
        type: String,
        required: true,
    },
    sponsor: String,
    requirement: String,
    winners: [String],
});
export const giveawayModel = model('new-giveaways', schema);
