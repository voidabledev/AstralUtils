/* eslint-disable @typescript-eslint/no-unused-vars */
import { modmailModel, Modmail } from '../models/modmailModel';
import { Collection, Snowflake } from 'discord.js';
import { Client } from '../modules/client';
// TODO: finish modmail
export class ModmailManager {
  private _cache = new Collection<string, Modmail>()
  constructor(private _client: Client) {
  	this.cache();
  }
  async cache(): Promise<void> {
  	const entries = await modmailModel.find({});
  	entries.forEach(e => this._cache.set(e.channelId, e));
  }
  getPrevious(userId: Snowflake): Collection<Snowflake, Modmail> {
  	return this._cache.filter((modmail) => modmail.userId === userId);
  }
  getByUser(userId: Snowflake): Modmail | undefined {
  	return this._cache.find((modmail) => !modmail.closed && modmail.userId === userId) ?? undefined;
  }
  getByChannel(channelId: Snowflake): Modmail | undefined {
  	return this._cache.get(channelId) ?? undefined;
  }
  async create(modmail: Modmail): Promise<Modmail> {
  	await new modmailModel(modmail).save();
 		this._cache.set(modmail.channelId, modmail);
  	return modmail;
  }
  async close(channelId: string): Promise<Modmail | undefined> {
  	const modmail = await modmailModel.findOneAndUpdate({ channelId }, { closed: true });
  	modmail.closed = true;
  	this._cache.set(modmail.channelId, modmail);
  	return modmail;
  }
  async addMessage(channelId: string, content: string, messageIds: [string, string], author: string): Promise<Modmail> {
  	const modmail = await modmailModel.findOneAndUpdate({ channelId }, {
  		$push: {
  			messages: {
  				content,
  				messageIds,
  				author,
  			},
  		},
  	});
  	modmail.messages.push({ content, messageIds, author });
  	this._cache.set(channelId, modmail);
  	return modmail;
  }
  async claim(channelId: string, staffId: string | undefined): Promise<Modmail | undefined> {
  	const modmail = await modmailModel.findOneAndUpdate({ channelId }, { staffId });
  	modmail.staffId = staffId;
  	this._cache.set(channelId, modmail);
  	return modmail;
  }
  find(callback: (modmail: Modmail) => boolean): Modmail | undefined {
  	return this._cache.find(callback);
  }
  async edit(channelId: string, edited: Modmail): Promise<Modmail> {
  	await modmailModel.updateOne({ channelId }, edited);
  	this._cache.set(channelId, edited);
  	return edited;
  }
}