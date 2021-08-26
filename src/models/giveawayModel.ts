import { model, Schema } from 'mongoose';

export interface GiveawayData {
  messageId: string;
  channelId: string;
  guildId: string;
  entries: string[];
  prize: string;
  start: number;
  end: number;
  winnerCount: number;
  ended: boolean;
  host: string;
  sponsor?: string;
  requirement?: string;
  winners?: string[];
}

export interface CreateData {
  messageId?: string;
  channelId: string;
  guildId: string;
  prize: string;
  start: number;
  end: number;
  winnerCount: number;
  host: string;
  sponsor?: string;
  ended?: boolean;
  entries?: string[];
  requirement?: string;
  winners?: string[];
}

export interface UpdateData {
  messageId?: string;
  channelId?: string;
  guildId?: string;
  prize?: string;
  start?: number;
  end?: number;
  winnerCount?: number;
  host?: string;
  sponsor?: string;
  ended?: boolean;
  entries?: string[];
  requirement?: string;
  winners?: string[];
}

const schema = new Schema({
	messageId: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	entries: {
		type: [String],
		required: true,
	},
	prize: {
		type: String,
		required: true,
	},
	start: {
		type: Number,
		required: true,
	},
	end: {
		type: Number,
		required: true,
	},
	winnerCount: {
		type: Number,
		required: true,
	},
	ended: {
		type: Boolean,
		required: true,
	},
	host: {
		type: String,
		required: true,
	},
	sponsor: String,
	requirement: String,
	winners: [String],
});

export const giveawayModel = model<GiveawayData>('new-giveaways', schema);
