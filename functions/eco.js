const eco = require('../models/ecoschema');
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
	if (Date.now() - profile.lastXP < 30000) return;
	/* Increase bank capacity, chat money and exp. */
	const bankAdd = 20 + Math.floor(Math.random() * 30);
	const walletAdd = 10 + Math.floor(Math.random() * 30);
	// const expAdd = 20 + Math.floor(Math.random() * 20);
	await eco.updateOne(profile, {
		$inc: {
			'bank.capacity': bankAdd,
			wallet: walletAdd,
			// exp: expAdd,
		},
	});
	/* Level up, if applicable */
	/*
		if(100 * (profile.level + 1) > profile.exp + expAdd) return;
		await eco.updateOne({ userID: message.author.id }, {
			$inc: {
				level: 1,
				exp: -100 * (profile.level + 1),
			},
		});
		message.channel.send(
			`⚡ Guess what, ${message.author}, you have reached level **${profile.level + 1}**!`,
		);
		*/
}
module.exports = ecos;
