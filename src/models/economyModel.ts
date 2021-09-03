import { model, Schema } from 'mongoose';

export interface EconomyProfile {
  userId: string;
  coins: number;
  itemIds: { [itemId: string]: number | undefined };
}

const schema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	coins: {
		type: Number,
		default: 0,
		required: true,
	},
	itemIds: {
		type: Schema.Types.Mixed,
		required: true,
	},
});

export const economyModel = model<EconomyProfile>('new-economy', schema);
