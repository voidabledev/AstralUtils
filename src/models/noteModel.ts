import { model, Document, Schema } from 'mongoose';

export interface Pattern extends Document {
  userID: string;
  noteID: string;
  staffID: string;
  note: string;
}

const schema = new Schema({
	userID: {
		type: String,
		required: true,
	},
	noteID: {
		type: String,
		required: true,
	},
	staffID: {
		type: String,
		required: true,
	},
	note: {
		type: String,
		required: true,
	},
});

export const noteModel = model<Pattern>('notes', schema);
