import { model, Document, Schema } from 'mongoose';

interface Pattern extends Document {
	userID: string;
	managerID: string;
	strikeID: string;
}

export interface strike extends Document {
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

export const strikeModel = model<Pattern>('strikes', schema);
