import { model, Schema } from 'mongoose';

export interface AFK {
  userId: string;
  message: string;
}

const schema = new Schema({
	userId: String,
	message: String,
});

export const afkModel = model<AFK>('afk', schema);
