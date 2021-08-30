import { model, Schema } from 'mongoose';

export interface Modmail {
  userId: string;
  messages: {
		content: string;
		// DM message, channel message
		messageIds: [string, string];
		author: string;
	}[];
  channelId: string;
  staffId?: string;
	closed: boolean;
}

const reqString = {
	type: String,
	required: true,
};

const schema = new Schema({
	userId: reqString,
	channelId: reqString,
	messages: {
		type: [{
			content: String,
			author: String,
			messageIds: [String],
		}],
		required: true,
	},
	staffId: String,
	closed: {
		type: Boolean,
		required: true,
	},
});

export const modmailModel = model<Modmail>('modmails', schema);
