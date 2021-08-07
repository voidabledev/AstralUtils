import { model, Document, Schema } from 'mongoose';

interface Pattern extends Document {
  guildID: string,
	userID: string,
	punishID: string,
	staffID: string,
	reason: string,
	caseType: string,
	timestamp: number,
	expires?: number,
	isActive?: boolean,
}

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

export const economyModel = model<Pattern>('punishments', schema);