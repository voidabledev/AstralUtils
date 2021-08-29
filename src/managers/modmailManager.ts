/* eslint-disable @typescript-eslint/no-unused-vars */
import { modmailModel, Modmail } from '../models/modmailModel';
import { Collection, Snowflake } from 'discord.js';
import { Client } from '../modules/client';
// TODO: finish modmail
export class ModmailManager {
  private _cache = new Collection<string, Modmail>()
  constructor(private _client: Client) {}
  async loadModmails(): Promise<void> {
  	const entries = await modmailModel.find({});
  	entries.forEach(e => this._cache.set(e.userId, e));
  }
  getThreadFromAuthor(authorId: Snowflake): Modmail | undefined {
  	return this._cache.get(authorId);
  }
  getThreadFromChannel(channelId: Snowflake): Modmail | undefined {
  	return this._cache.find(modmail => modmail.channelIds.includes(channelId));
  }
  async createThread(modmail: Modmail): Promise<void> {
  	await new modmailModel(modmail).save();
  	this._cache.set(modmail.userId, modmail);
  }
  async deleteThread(userId: string): Promise<void> {
  	await modmailModel.deleteOne({ userId });
  	this._cache.delete(userId);
  }
}