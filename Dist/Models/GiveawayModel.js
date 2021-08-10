"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveawayModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
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
});
exports.giveawayModel = mongoose_1.model('new-giveaways', schema);
