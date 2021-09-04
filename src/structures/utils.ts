import { promisify } from 'util';
import glob from 'glob';
import { Client } from './client';
import { PresenceData } from 'discord.js';

type ZeroToRandom = (num: number) => number;
type AnyToRandom = (min: number, max: number) => number;

type Random = ZeroToRandom | AnyToRandom;

export const random: Random = (min: number, max?: number): number => {

	if (max === undefined) {
		max = min;
		min = 0;
	}

	return min + Math.round(Math.random() * (max - min));
};

export const search = promisify(glob);
export const wait = promisify(setTimeout);
export function id(base: number, length: number): string {
	let gen = Math.floor(Math.random() * base ** length).toString(base);
	gen = '0'.repeat(length - gen.length) + gen;
	return gen;
}
export const setCharAt = (str: string, index: number, chr: string): string => {
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
};

const data: PresenceData[] = [
	{
		status: 'online',
		activities: [{ name: 'with code', type: 'PLAYING' }],
	},
	{
		status: 'idle',
		activities: [{ name: 'the developers yelling at me', type: 'WATCHING' }],
	},
	{
		status: 'dnd',
		activities: [{ name: 'with your computer', type: 'PLAYING' }],
	},
	{
		status: 'dnd',
		activities: [{ name: 'Minecraft', type: 'PLAYING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'with the other bots', type: 'PLAYING' }],
	},
	{
		status: 'idle',
		activities: [{ name: 'with your feelings', type: 'PLAYING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'you', type: 'WATCHING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'you', type: 'WATCHING' }],
	},
	{
		status: 'dnd',
		activities: [{ name: 'Simon Says', type: 'COMPETING' }],
	},
	{
		status: 'idle',
		activities: [{ name: 'my fav songs', type: 'LISTENING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'over the galaxy', type: 'WATCHING' }],
	},
	{
		status: 'dnd',
		activities: [{ name: 'the sky', type: 'WATCHING' }],
	},
	{
		status: 'idle',
		activities: [{ name: 'with code', type: 'PLAYING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'you like a fiddle', type: 'PLAYING' }],
	},
	{
		status: 'dnd',
		activities: [{ name: 'alone', type: 'PLAYING' }],
	},
	{
		status: 'dnd',
		activities: [{ name: 'dead', type: 'PLAYING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'Discord', type: 'PLAYING' }],
	},
	{
		status: 'idle',
		activities: [{ name: 'with fire', type: 'PLAYING' }],
	},
	{
		status: 'online',
		activities: [{ name: 'everyone', type: 'WATCHING' }],
	},
];

export const activity = async (client: Client): Promise<void> => {
	client.user.setPresence(data[random(0, data.length - 1)]);
};