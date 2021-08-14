import { model, Document, Schema } from 'mongoose';

export interface AFK {
	userId: string;
	message: string;
}

interface Pattern extends Document {
	userId: string;
	message: string;
}

const schema = new Schema({
	userId: String,
	message: String,
});

export const afkModel = model<Pattern>('afk', schema);
