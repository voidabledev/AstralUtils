/* eslint-disable no-unused-vars */
const ecos = require('../models/ecoschema');
const eco = {
	/**
	 * All available items.
	 */
	items: [
		{
			name: 'vip',
			displayName: 'VIP Role',
			cost: 200000,
			description: 'A high role position.',
			inv: false,
			async execute(message, amount) {
				try {
					await message.member.roles.add('831996404549419018');
					return 'Take the role, you earned it.';
				}
				catch {
					throw new Error('You already have the role, or I\'m missing permissions.');
				}
			},
		},
		{
			name: 'gold',
			displayName: 'Golden Coin',
			cost: 50000,
			description: 'An expensive golden coin, mainly to flex on normies.',
			inv: true,
			async execute(message, amount) {
				throw new Error('You can\'t use this item!');
			},
		},
		{
			name: 'gamble',
			displayName: 'Gambler\'s horseshoe',
			cost: 10000,
			description: 'Gives you higher outcome when gambling, but breaks when you lose.',
			inv: true,
			async execute(message, amount) {
				throw new Error('You can\'t use this item!');
			},
		},
	],
};

module.exports = eco;