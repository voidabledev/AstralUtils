import { model, Document, Schema } from 'mongoose';

export interface Modmail {
  userId: string;
  message: string|string[];
  categoryId: string;
  channelIds: string[];
  staffId: string;
}

interface Pattern extends Document {
  userId: string;
  message: string|string[];
  categoryId: string;
  channelIds: string[];
  staffId: string;
}

const reqString = {
  type: String,
  required: true
}

const schema = new Schema({
  userId: reqString,
  message: reqString,
  categoryId: reqString,
  channelIds: reqString,
  staffId: reqString,
});

export const modmailModel = model<Pattern>('modmails', schema);
