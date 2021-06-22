const eco = require('../models/ecoschema');
/**
 * Create an economy profile for the user if none exists yet.
 * Add a random amount of chat coins and back storage.
 * (Add EXP and level the user up if needed.)
 * @param {Object} message The discord.js message object
 * @returns {void} Nothing
 */
async function ecos(message) {
	/* Fetch the profile, or create one if it doesn't exist yet */
	const profile = await eco.findOne({ userID: message.author.id }) ||
			await eco.create({
				userID: message.author.id,
				wallet: 0,
				bank: {
					value: 0,
					capacity: 1000,
				},
				level: 0,
				exp: 0,
				lastXP: 0,
			});
		/* Proceed with the rest only if the last counted message is more than 30 seconds in the past */
	if (Date.now() - profile.lastXP < 20000) return;
	/* Increase bank capacity, chat money and exp. */
	const bankAdd = 20 + Math.floor(Math.random() * 30);
	const walletAdd = 10 + Math.floor(Math.random() * 30);
	// ! const expAdd = 20 + Math.floor(Math.random() * 20);
	// ! const isLevelUp = 100 * (profile.level + 1) > profile.exp + expAdd;
	await eco.updateOne(profile, {
		$inc: {
			'bank.capacity': bankAdd,
			wallet: walletAdd,
			// ! exp: expAdd - (isLevelUp ? 100 * (profile.level + 1) : 0),
			// ! level: isLevelUp ? 1 : 0,
		},
		lastXP: Date.now(),
	});
	/*
	if (isLevelUp) {
		message.channel.send(
			`⚡ Guess what, ${message.author}, you have reached level **${profile.level + 1}**!`,
		);
	}
	*/
}
module.exports = ecos;
