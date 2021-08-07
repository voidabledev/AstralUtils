"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modlogModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    guildID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    punishID: {
        type: String,
        required: true,
    },
    staffID: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    caseType: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    expires: Number,
    isActive: Boolean,
});
exports.modlogModel = mongoose_1.model('punishments', schema);
