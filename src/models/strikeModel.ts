import { model, Document, Schema } from 'mongoose';
export interface Strike extends Document {
	userID: string;
	managerID: string;
	strikeID: string;
}

const schema = new Schema({
	userID: {
		type: String,
		required: true,
	},
	managerID: {
		type: String,
		required: true,
	},
	strikeID: {
		type: String,
		required: true,
	},
});

export const strikeModel = model<Strike>('strikes', schema);
