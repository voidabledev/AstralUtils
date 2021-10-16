import { noteModel, Pattern as Note } from '../models/noteModel';
import { Collection } from 'discord.js';
import { id } from '../structures/utils';

export class NoteManager {
	private _cache: Collection<string, Note>;
	constructor() {
		this._cache = new Collection<string, Note>();
		this.cache();
	}
	async cache(): Promise<void> {
		const notes = await noteModel.find({});
		notes.forEach((note) => this._cache.set(note.noteId, note));
	}
	get(noteId: string): Note | undefined {
		return this._cache.get(noteId);
	}
	find(userId: string): Collection<string, Note> {
		return this._cache.filter((note) => note.userId === userId);
	}
	async set(userId: string, staffId: string, note: string): Promise<Note> {
		let noteId = id(16, 6);
		while (this.get(noteId)) noteId = id(10, 10);
		const entry = await noteModel.create({
			userId,
			staffId,
			noteId,
			note,
			timestamp: Date.now(),
		});
		this._cache.set(noteId, entry);
		return entry;
	}
	async delete(noteId: string): Promise<boolean> {
		if (!this.get(noteId)) return false;
		await noteModel.deleteOne({ noteId });
		this._cache.delete(noteId);
		return true;
	}
}