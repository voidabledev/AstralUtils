import { model, Document, Schema } from 'mongoose';

export interface Pattern extends Document {
  userId: string;
  noteId: string;
  staffId: string;
  note: string;
	timestamp: number;
}

const schema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	noteId: {
		type: String,
		required: true,
	},
	staffId: {
		type: String,
		required: true,
	},
	note: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Number,
		required: true,
	},
});

export const noteModel = model<Pattern>('notes', schema);
