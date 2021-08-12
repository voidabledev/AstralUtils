import { model, Schema } from 'mongoose';
const schema = new Schema({
    userId: String,
    coins: {
        type: Number,
        default: 0,
    },
    itemIds: [String],
});
export const economyModel = model('economy', schema);
