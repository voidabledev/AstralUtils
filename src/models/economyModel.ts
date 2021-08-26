import { model, Schema } from 'mongoose';

export interface EconomyProfile {
  userId: string;
  coins: number;
  itemIds: string[];
}

const schema = new Schema({
	userId: String,
	coins: {
		type: Number,
		default: 0,
	},
	itemIds: [String],
});

export const economyModel = model<EconomyProfile>('economy', schema);
