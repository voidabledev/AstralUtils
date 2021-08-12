import { model, Schema } from 'mongoose';
const schema = new Schema({
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
export const modlogModel = model('punishments', schema);
