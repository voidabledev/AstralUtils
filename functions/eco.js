const eco = require('../models/ecoschema');
const ecos = {
	/**
	 * Issues a levelup, if one is needed.
	 * @param {Object} message The message triggering the levelup.
	 */
	async levelup(message) {
		const profile = await eco.findOne({ userID: message.author.id });
		if(100 * (profile.level + 1) > profile.exp) return;
		await eco.updateOne({ userID: message.author.id }, {
			$inc: {
				level: 1,
				exp: -100 * (profile.level + 1),
			},
		});
		message.channel.send(
			`⚡ Guess what, ${message.author}, you have reached level **${profile.level + 1}**!`,
		);
		ecos.reward(message);
	},
	async reward(message) {
		const { levels } = require('../json/roles.json');
		const profile = eco.findOne({ userID: message.author.id });
		let prev;
		let r;
		for (const l in levels) {
			if (profile.level >= parseInt(l)) {
				prev = r;
				r = levels[l];
			}
			else {
				break;
			}
		}
		try {
			message.member.roles.add(r);
			message.member.roles.remove(prev);
		}
		catch {
			//
		}
	},
	/**
	 * Adds a random amount of EXP.
	 * @param {Object} message The discord.js message object.
	 */
	async addXP(message) {
		const amount = 20 + Math.floor(Math.random() * 20);
		const profile = await eco.findOne({ userID: message.author.id });
		if(Date.now() - profile.lastXP < 30000) return;
		await eco.updateOne(profile, {
			$inc: {
				exp: amount,
			},
			lastXP: Date.now(),
		});
	},
	/**
	 * Adds a random amount of extra bank balance.
	 * @param {Object} message The discord.js message object.
	 */
	async bank(message) {
		const amount = 30 + Math.floor(Math.random() * 70);
		const chat = 10 + Math.floor(Math.random() * 20);
		const profile = await eco.findOne({ userID: message.author.id });
		if (profile) {
			await eco.updateOne(profile, {
				$inc: {
					'bank.capacity': amount,
					wallet: chat,
				},
			});
		}
	},
	/**
	 * Creates an economy profile for a user, going off a message.
	 * @param {Object} message The discord.js message object.
	 */
	async create(message) {
		await eco.create({
			userID: message.author.id,
			wallet: 0,
			bank: {
				value: 0,
				capacity: 1000,
			},
			level: 0,
			exp: 0,
			lastXP: Date.now(),
		});
	},
	async execute(message) {
		if (!await eco.findOne({ userID: message.author.id })) ecos.create(message);
		await ecos.bank(message);
		await ecos.addXP(message);
		await ecos.levelup(message);
	},
};
module.exports = ecos;